// hooks/useBiometricGate.ts
import { BiometricsTranslations, NAMESPACES } from '@/i18n/constants';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AppState, AppStateStatus, Linking, Platform } from 'react-native';

type AuthEvent = 'attempt' | 'success' | 'cancel' | 'error' | 'fallback' | 'locked';

export interface UseBiometricGateOptions {
  /** Idle timeout to lock, in ms (e.g., 5 * 60 * 1000) */
  idleTimeoutMs: number;
  /** Debounce between prompts, in ms (e.g., 1500) */
  throttleMs: number;
  /** Whether biometrics are required to unlock */
  requireBiometrics: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onAuthEvent?: (event: AuthEvent, meta?: Record<string, unknown>) => void;
}

export interface UseBiometricGateApi {
  /** Current lock state */
  isLocked: boolean;
  /** Forces the authentication prompt (when applicable) */
  authenticate: (force?: boolean) => Promise<void>;
  /** Marks user activity and resets the idle timer */
  markActivity: () => void;
}

const promptEnableFaceIdForAppOnce = (() => {
  let shown = false;
  return (options: {
    title: string;
    description: string;
    openSettings: string;
    cancel: string;
  }) => {
    if (shown) return;
    shown = true;
    Alert.alert(options.title, options.description, [
      { text: options.cancel, style: 'cancel' },
      ...(Platform.OS === 'ios'
        ? [{ text: options.openSettings, onPress: () => Linking.openSettings() }]
        : []),
    ]);
  };
})();

/**
 * Biometric gate hook:
 * - Locks on background or inactivity.
 * - Triggers prompt only when the app is 'active', avoiding duplicates.
 * - Face/Touch first; otherwise, passcode.
 */
export function useBiometricGate({
  idleTimeoutMs,
  throttleMs,
  requireBiometrics,
  onLock,
  onUnlock,
  onAuthEvent,
}: UseBiometricGateOptions): UseBiometricGateApi {
  const { t } = useTranslation(NAMESPACES.BIOMETRICS);
  const isExpoGo = Constants.appOwnership === 'expo';
  const [isLocked, setIsLocked] = useState<boolean>(requireBiometrics && !isExpoGo);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastPromptAtRef = useRef<number>(0);
  const promptInFlightRef = useRef<boolean>(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Clears the idle timeout */
  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  /** Arms the idle timer (when biometrics are required) */
  const armIdleTimer = useCallback(() => {
    clearIdleTimer();
    if (!requireBiometrics || isExpoGo) return;
    idleTimerRef.current = setTimeout(() => {
      setIsLocked(true);
      onAuthEvent?.('locked', { reason: 'idle_timeout' });
      onLock?.();
    }, idleTimeoutMs);
  }, [clearIdleTimer, idleTimeoutMs, isExpoGo, onAuthEvent, onLock, requireBiometrics]);

  /** Allows the UI to mark activity and reset the idle timer */
  const markActivity = useCallback(() => {
    armIdleTimer();
  }, [armIdleTimer]);

  /** Checks if we can trigger the prompt now */
  const canPromptNow = useCallback(
    (force = false): boolean => {
      const now = Date.now();
      if (promptInFlightRef.current) return false;
      if (!force && now - lastPromptAtRef.current < throttleMs) return false;
      if (appStateRef.current !== 'active') return false;
      return true;
    },
    [throttleMs],
  );

  /** Authentication prompt (biometrics first; then passcode) */
  const authenticate = useCallback(
    async (force = false) => {
      if (!canPromptNow(force)) return;

      promptInFlightRef.current = true;
      lastPromptAtRef.current = Date.now();

      try {
        onAuthEvent?.('attempt');

        // Never prompt biometrics in Expo Go
        if (isExpoGo) {
          setIsLocked(false);
          onUnlock?.();
          armIdleTimer();
          return;
        }

        // Pre-checks
        const [hasHardware, isEnrolled, types] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);

        if (!hasHardware) {
          onAuthEvent?.('error', { reason: 'no_hardware' });
          if (requireBiometrics) {
            setIsLocked(true);
            onLock?.();
            return;
          } else {
            setIsLocked(false);
            onUnlock?.();
            armIdleTimer();
            return;
          }
        }

        if (!isEnrolled) {
          // No Face ID/Touch ID enrolled on the device
          onAuthEvent?.('fallback', { reason: 'not_enrolled', types });
          if (requireBiometrics) {
            setIsLocked(true);
            onLock?.();
            return;
          } else {
            setIsLocked(false);
            onUnlock?.();
            armIdleTimer();
            return;
          }
        }

        const supportsBiometric = types?.some(
          (t) =>
            t === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION ||
            t === LocalAuthentication.AuthenticationType.FINGERPRINT,
        );

        // -------- Attempt 1: biometrics only (no passcode) --------
        const first = await LocalAuthentication.authenticateAsync({
          promptMessage: t(BiometricsTranslations.PROMPT_MESSAGE),
          cancelLabel: t(BiometricsTranslations.PROMPT_CANCEL_LABEL),
          requireConfirmation: false,
          disableDeviceFallback: true,
        });

        if (first.success) {
          setIsLocked(false);
          onAuthEvent?.('success', { via: 'biometric', result: first });
          onUnlock?.();
          armIdleTimer();
          return;
        }

        // Explicit cancel by the user or the system
        const err = (first as any).error as string | undefined;
        const isCancel = ['user_cancel', 'system_cancel', 'app_cancel'].includes(err ?? '');
        if (isCancel) {
          onAuthEvent?.('cancel', first as any);
          setIsLocked(true);
          onLock?.();
          return;
        }

        // Do NOT show "enable Face ID" if it's a lockout (codes vary by platform/version)
        const isLockout = [
          'lockout',
          'lockout_temporary',
          'biometry_lockout',
          'device_locked',
        ].includes(err ?? '');
        const isFallback = ['user_fallback'].includes(err ?? '');

        // Show alert ONLY if it is actually an availability/permission issue
        if (
          supportsBiometric &&
          (first.error === 'not_available' || first.error === 'not_enrolled')
        ) {
          onAuthEvent?.('error', { reason: 'biometry_unavailable_or_disabled', first });
          promptEnableFaceIdForAppOnce({
            title: t(BiometricsTranslations.ENABLE_FACEID_TITLE),
            description: t(BiometricsTranslations.ENABLE_FACEID_DESCRIPTION),
            openSettings: t(BiometricsTranslations.OPEN_SETTINGS),
            cancel: t(BiometricsTranslations.PROMPT_CANCEL_LABEL),
          });
        }

        // -------- Attempt 2 (optional): allow passcode --------
        // Use passcode if there was a lockout/other errors, or if #1 simply failed.
        const second = await LocalAuthentication.authenticateAsync({
          promptMessage: t(BiometricsTranslations.PROMPT_MESSAGE),
          cancelLabel: t(BiometricsTranslations.PROMPT_CANCEL_LABEL),
          requireConfirmation: false,
          disableDeviceFallback: false,
        });

        if (second.success) {
          setIsLocked(false);
          onAuthEvent?.('success', {
            via: isLockout || isFallback ? 'fallback_after_lockout' : 'fallback_passcode',
            result: second,
          });
          onUnlock?.();
          armIdleTimer();
        } else {
          const kind =
            second.error === 'user_cancel' || second.error === 'system_cancel' ? 'cancel' : 'error';
          onAuthEvent?.(kind as AuthEvent, { first, second });
          setIsLocked(true);
          onLock?.();
        }
      } catch (err: any) {
        onAuthEvent?.('error', { message: err?.message ?? String(err) });
        setIsLocked(true);
        onLock?.();
      } finally {
        promptInFlightRef.current = false;
      }
    },
    [armIdleTimer, canPromptNow, isExpoGo, onAuthEvent, onLock, onUnlock, requireBiometrics, t],
  );

  /** AppState control to lock when going to background and auto-prompt on return */
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (prev.match(/active|inactive/) && next === 'background') {
        if (requireBiometrics && !isExpoGo) {
          setIsLocked(true);
          onAuthEvent?.('locked', { reason: 'background' });
          onLock?.();
        }
        clearIdleTimer();
      }

      if (next === 'active') {
        // Re-arm idle and FORCE auto-prompt if locked
        armIdleTimer();
        if (requireBiometrics && !isExpoGo && isLocked) {
          // Ignore throttle when the user returns from Settings or multitasking
          setTimeout(() => authenticate(true), 150);
        }
      }
    });

    return () => sub.remove();
  }, [
    armIdleTimer,
    clearIdleTimer,
    onAuthEvent,
    onLock,
    isExpoGo,
    requireBiometrics,
    isLocked,
    authenticate,
  ]);

  /** Arm idle on mount; clear on unmount */
  useEffect(() => {
    if (requireBiometrics && !isExpoGo) setIsLocked(true);
    armIdleTimer();
    return clearIdleTimer;
  }, [armIdleTimer, clearIdleTimer, isExpoGo, requireBiometrics]);

  /** Initial auto-prompt (forced) when locked and the app is already active */
  useEffect(() => {
    if (!isLocked) return;
    if (appStateRef.current !== 'active') return;
    if (isExpoGo) return;
    // Small delay to avoid race conditions on the first render
    const id = setTimeout(() => authenticate(true), 100);
    return () => clearTimeout(id);
  }, [isExpoGo, isLocked, authenticate]);

  const api = useMemo<UseBiometricGateApi>(
    () => ({
      isLocked,
      authenticate,
      markActivity,
    }),
    [isLocked, authenticate, markActivity],
  );

  return api;
}
