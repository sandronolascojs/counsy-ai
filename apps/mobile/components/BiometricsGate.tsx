import { BLUR_INTENSITY, IDLE_TIMEOUT_MS, THROTTLE_MS } from '@/constants/biometric';
import { useBiometricGate } from '@/hooks/useBiometricGate';
import { BiometricsTranslations } from '@/i18n/constants';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { Button, SizableText, XStack, YStack } from 'tamagui';

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
  requireBiometrics = true,
  blurIntensity = BLUR_INTENSITY,
  onLock,
  onUnlock,
  onAuthEvent,
}: BiometricsGateProps) => {
  const { t } = useTranslation();
  const { isLocked, authenticate } = useBiometricGate({
    idleTimeoutMs,
    throttleMs,
    requireBiometrics,
    onLock,
    onUnlock,
    onAuthEvent,
  });

  if (!isLocked) return <>{children}</>;

  return (
    <YStack flex={1}>
      <BlurView
        intensity={blurIntensity}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <YStack flex={1} justify="center" items="center" p="$6" gap="$4" bg="transparent">
        <SizableText size="$7" fontWeight="700">
          {t(BiometricsTranslations.LOCKED_TITLE)}
        </SizableText>
        <SizableText size="$4" text="center" color="$color8">
          {t(BiometricsTranslations.LOCKED_SUBTITLE)}
        </SizableText>
        <XStack gap="$3" mt="$3">
          <Button size="$4" onPress={authenticate}>
            {t(BiometricsTranslations.UNLOCK)}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
};
