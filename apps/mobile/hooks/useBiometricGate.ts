// hooks/useBiometricGate.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Linking, Platform } from 'react-native';

type AuthEvent = 'attempt' | 'success' | 'cancel' | 'error' | 'fallback' | 'locked';

export interface UseBiometricGateOptions {
  /** Tiempo de inactividad para bloquear, en ms (ej. 5 * 60 * 1000) */
  idleTimeoutMs: number;
  /** Antirebote entre prompts, en ms (ej. 1500) */
  throttleMs: number;
  /** Si es obligatorio usar biometría para desbloquear */
  requireBiometrics: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onAuthEvent?: (event: AuthEvent, meta?: Record<string, unknown>) => void;
}

export interface UseBiometricGateApi {
  /** Estado de bloqueo actual */
  isLocked: boolean;
  /** Fuerza el prompt de autenticación (si corresponde) */
  authenticate: (force?: boolean) => Promise<void>;
  /** Marca actividad de usuario y rearma el temporizador de inactividad */
  markActivity: () => void;
}

const promptEnableFaceIdForAppOnce = (() => {
  let shown = false;
  return () => {
    if (shown) return;
    shown = true;
    Alert.alert(
      'Habilitar Face ID',
      'Para usar Face ID con esta app, activalo en Ajustes → [Tu App] → Face ID.',
      [
        { text: 'Cancelar', style: 'cancel' },
        ...(Platform.OS === 'ios'
          ? [{ text: 'Abrir Ajustes', onPress: () => Linking.openSettings() }]
          : []),
      ],
    );
  };
})();

/**
 * Hook para puerta biométrica:
 * - Bloquea al ir a background o por inactividad.
 * - Lanza prompt solo cuando la app está 'active', evitando duplicados.
 * - Face/Touch primero; si no, passcode.
 */
export function useBiometricGate({
  idleTimeoutMs,
  throttleMs,
  requireBiometrics,
  onLock,
  onUnlock,
  onAuthEvent,
}: UseBiometricGateOptions): UseBiometricGateApi {
  const [isLocked, setIsLocked] = useState<boolean>(requireBiometrics);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastPromptAtRef = useRef<number>(0);
  const promptInFlightRef = useRef<boolean>(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Limpia el timer de inactividad */
  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  /** Rearma el timer de inactividad (si la biometría es requerida) */
  const armIdleTimer = useCallback(() => {
    clearIdleTimer();
    if (!requireBiometrics) return;
    idleTimerRef.current = setTimeout(() => {
      setIsLocked(true);
      onAuthEvent?.('locked', { reason: 'idle_timeout' });
      onLock?.();
    }, idleTimeoutMs);
  }, [clearIdleTimer, idleTimeoutMs, onAuthEvent, onLock, requireBiometrics]);

  /** Permite a la UI marcar actividad y resetear el idle timer */
  const markActivity = useCallback(() => {
    armIdleTimer();
  }, [armIdleTimer]);

  /** Chequea si podemos lanzar prompt ahora */
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

  /** Prompt de autenticación (biometrics-first; luego passcode) */
  const authenticate = useCallback(
    async (force = false) => {
      if (!canPromptNow(force)) return;

      promptInFlightRef.current = true;
      lastPromptAtRef.current = Date.now();

      try {
        onAuthEvent?.('attempt');

        // Chequeos previos
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
          // No hay Face ID/Touch ID configurado en el device
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

        // -------- Intento 1: solo biometría (sin passcode) --------
        const first = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Desbloquear con Face ID/Touch ID',
          cancelLabel: 'Cancelar',
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

        // Cancel explícito del usuario o del sistema
        const err = (first as any).error as string | undefined;
        const isCancel = ['user_cancel', 'system_cancel', 'app_cancel'].includes(err ?? '');
        if (isCancel) {
          onAuthEvent?.('cancel', first as any);
          setIsLocked(true);
          onLock?.();
          return;
        }

        // NO mostrar "habilitá Face ID" si es lockout (códigos varían por plataforma/versión)
        const isLockout = [
          'lockout',
          'lockout_temporary',
          'biometry_lockout',
          'device_locked',
        ].includes(err ?? '');
        const isFallback = ['user_fallback'].includes(err ?? '');

        // Mostrar alerta SOLO si realmente es disponibilidad/permisos
        if (
          supportsBiometric &&
          (first.error === 'not_available' || first.error === 'not_enrolled')
        ) {
          onAuthEvent?.('error', { reason: 'biometry_unavailable_or_disabled', first });
          promptEnableFaceIdForAppOnce();
        }

        // -------- Intento 2 (opcional): permitir passcode --------
        // Usamos passcode si hubo lockout/otros errores, o si simplemente falló el #1.
        const second = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Desbloquear',
          cancelLabel: 'Cancelar',
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
    [armIdleTimer, canPromptNow, onAuthEvent, onLock, onUnlock, requireBiometrics],
  );

  /** Control del AppState para bloquear al ir a background y autoprompt al volver */
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (prev.match(/active|inactive/) && next === 'background') {
        if (requireBiometrics) {
          setIsLocked(true);
          onAuthEvent?.('locked', { reason: 'background' });
          onLock?.();
        }
        clearIdleTimer();
      }

      if (next === 'active') {
        // Rearma idle y autoprompt FORZADO si está bloqueado
        armIdleTimer();
        if (requireBiometrics && isLocked) {
          // ignoramos throttle cuando el usuario vuelve desde Settings o multitarea
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
    requireBiometrics,
    isLocked,
    authenticate,
  ]);

  /** Armar idle al montar; limpiar al desmontar */
  useEffect(() => {
    if (requireBiometrics) setIsLocked(true);
    armIdleTimer();
    return clearIdleTimer;
  }, [armIdleTimer, clearIdleTimer, requireBiometrics]);

  /** Auto-prompt inicial (forzado) cuando está bloqueado y la app ya está activa */
  useEffect(() => {
    if (!isLocked) return;
    if (appStateRef.current !== 'active') return;
    // pequeño delay para evitar condiciones de carrera en el primer render
    const id = setTimeout(() => authenticate(true), 100);
    return () => clearTimeout(id);
  }, [isLocked, authenticate]);

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
