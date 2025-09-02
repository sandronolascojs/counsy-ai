import { IDLE_TIMEOUT_MS, THROTTLE_MS } from '@/constants/biometric';
import { BiometricsTranslations, NAMESPACES } from '@/i18n/constants';
import { mobileLogger } from '@/utils/logger';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ScreenCapture from 'expo-screen-capture';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, AppStateStatus, Platform } from 'react-native';

export type AuthEvent = 'attempt' | 'success' | 'cancel' | 'error' | 'fallback' | 'locked';

export interface UseBiometricGateOptions {
  idleTimeoutMs?: number;
  throttleMs?: number;
  requireBiometrics?: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onAuthEvent?: (event: AuthEvent, meta?: Record<string, unknown>) => void;
}

export interface UseBiometricGateResult {
  isLocked: boolean;
  authenticate: () => Promise<void>;
  promptLabels: {
    promptMessage: string;
    fallbackLabel: string;
    cancelLabel: string;
  };
}

export const useBiometricGate = ({
  idleTimeoutMs = IDLE_TIMEOUT_MS,
  throttleMs = THROTTLE_MS,
  requireBiometrics = true,
  onLock,
  onUnlock,
  onAuthEvent,
}: UseBiometricGateOptions = {}): UseBiometricGateResult => {
  const { t } = useTranslation(NAMESPACES.BIOMETRICS);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isAuthenticatingRef = useRef<boolean>(false);
  const biometricsAvailableRef = useRef<boolean | null>(null);
  const lastAuthAtRef = useRef<number>(0);
  const lastInteractionAtRef = useRef<number>(Date.now());
  const cancelBackoffUntilRef = useRef<number>(0);

  const promptOptions = useMemo(
    () => ({
      promptMessage: t(BiometricsTranslations.PROMPT_MESSAGE),
      fallbackLabel: t(BiometricsTranslations.PROMPT_FALLBACK_LABEL),
      disableDeviceFallback: requireBiometrics,
      cancelLabel: t(BiometricsTranslations.PROMPT_CANCEL_LABEL),
    }),
    [requireBiometrics, t],
  );

  const setLocked = useCallback(
    (locked: boolean) => {
      setIsLocked((prev) => {
        if (prev === locked) return prev;
        if (locked) {
          mobileLogger.info('locked');
          onLock?.();
          onAuthEvent?.('locked');
        } else {
          mobileLogger.info('unlocked');
          onUnlock?.();
          onAuthEvent?.('success');
        }
        return locked;
      });
    },
    [onLock, onUnlock, onAuthEvent],
  );

  const authenticate = useCallback(async () => {
    if (isAuthenticatingRef.current) return;
    const now = Date.now();
    if (now - lastAuthAtRef.current < throttleMs) return;
    if (now < cancelBackoffUntilRef.current) return;
    lastAuthAtRef.current = now;

    isAuthenticatingRef.current = true;
    try {
      onAuthEvent?.('attempt');
      if (Platform.OS === 'web') {
        if (isLocked) setLocked(false);
        return;
      }

      if (biometricsAvailableRef.current == null) {
        const [hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
        ]);
        biometricsAvailableRef.current = hasHardware && isEnrolled;
      }

      if (!biometricsAvailableRef.current) {
        if (isLocked) setLocked(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync(promptOptions);
      const nextLocked = !result.success;
      if (!result.success) {
        if (result.error === 'user_cancel') {
          onAuthEvent?.('cancel');
          mobileLogger.warn('auth cancel');
          const nowTs = Date.now();
          const currentDelay = Math.max(0, cancelBackoffUntilRef.current - nowTs) || 2000;
          cancelBackoffUntilRef.current = nowTs + Math.min(30000, currentDelay * 2);
        } else if (result.error) {
          onAuthEvent?.('error', { error: result.error });
          mobileLogger.error('auth error', { error: result.error });
        }
      }
      setLocked(nextLocked);
    } finally {
      isAuthenticatingRef.current = false;
    }
  }, [isLocked, onAuthEvent, promptOptions, setLocked, throttleMs]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (Platform.OS === 'web') {
        biometricsAvailableRef.current = false;
        if (isLocked) setLocked(false);
        return;
      }

      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      biometricsAvailableRef.current = hasHardware && isEnrolled;
      if (!isMounted) return;
      if (!biometricsAvailableRef.current) {
        setLocked(false);
        return;
      }
      if (isLocked) authenticate();
    })();

    (async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync();
      } catch (error) {
        mobileLogger.error('screen capture prevent error', { error });
      }
    })();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const prev = appStateRef.current;
      const wasInBackground = /inactive|background/.test(prev);
      appStateRef.current = nextAppState;

      if (nextAppState === 'background') {
        if (!isLocked) setLocked(true);
        return;
      }

      if (wasInBackground && nextAppState === 'active') {
        if (isLocked && biometricsAvailableRef.current !== false) {
          authenticate();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [authenticate, isLocked, setLocked]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (Date.now() - lastInteractionAtRef.current >= idleTimeoutMs) {
          setLocked(true);
        }
      },
      Math.min(30000, idleTimeoutMs),
    );
    return () => clearInterval(interval);
  }, [idleTimeoutMs, setLocked]);

  useEffect(() => {
    if (!isLocked) lastInteractionAtRef.current = Date.now();
  }, [isLocked]);

  const promptLabels = useMemo(
    () => ({
      promptMessage: t(BiometricsTranslations.PROMPT_MESSAGE),
      fallbackLabel: t(BiometricsTranslations.PROMPT_FALLBACK_LABEL),
      cancelLabel: t(BiometricsTranslations.PROMPT_CANCEL_LABEL),
    }),
    [t],
  );

  return { isLocked, authenticate, promptLabels };
};
