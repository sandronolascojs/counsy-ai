import Logo from '@/components/Logo';
import { BLUR_INTENSITY, IDLE_TIMEOUT_MS, THROTTLE_MS } from '@/constants/biometric';
import { FALLBACK_BRAND_COLOR_HEX } from '@/constants/themes';
import { useBiometricGate } from '@/hooks/useBiometricGate';
import { BlurView } from 'expo-blur';
import { useTheme, YStack } from 'tamagui';

interface BiometricsGateProps {
  children: React.ReactNode;
  idleTimeoutMs?: number;
  throttleMs?: number;
  requireBiometrics?: boolean;
  blurIntensity?: number;
  onLock?: () => void;
  onUnlock?: () => void;
  onAuthEvent?: (
    event: 'attempt' | 'success' | 'cancel' | 'error' | 'fallback' | 'locked',
    meta?: Record<string, unknown>,
  ) => void;
}

export const BiometricsGate = ({
  children,
  idleTimeoutMs = IDLE_TIMEOUT_MS,
  throttleMs = THROTTLE_MS,
  requireBiometrics = false,
  blurIntensity = BLUR_INTENSITY,
  onLock,
  onUnlock,
  onAuthEvent,
}: BiometricsGateProps) => {
  const theme = useTheme();
  const { isLocked } = useBiometricGate({
    idleTimeoutMs,
    throttleMs,
    requireBiometrics,
    onLock,
    onUnlock,
    onAuthEvent,
  });

  if (!isLocked) return <>{children}</>;

  return (
    <YStack flex={1} bg="$background">
      <BlurView
        intensity={blurIntensity}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <YStack flex={1} justify="center" items="center" bg="transparent">
        <Logo
          width={96}
          height={96}
          color={
            (theme.accentColor?.get?.() as string | undefined) ||
            (theme.accent1?.get?.() as string | undefined) ||
            FALLBACK_BRAND_COLOR_HEX
          }
        />
      </YStack>
    </YStack>
  );
};
