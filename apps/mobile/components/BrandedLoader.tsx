import Logo from '@/components/Logo';
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Text, useTheme, YStack } from 'tamagui';

// Animation configuration constants
const FLOAT_CYCLE_DURATION_MS = 1800; // Total time for one float up/down cycle
const FLOAT_REPEAT_INFINITE = -1; // Repeat indefinitely
const FLOAT_EASING = Easing.inOut(Easing.quad); // Smooth ease in/out
const FLOAT_AMPLITUDE_PX = 8; // Max vertical movement in pixels
const FLOAT_VERTICAL_OFFSET_PX = 4; // Offset to center around 0 visually
const BREATHING_SCALE_FACTOR = 0.04; // Subtle scaling for breathing effect

// UI constants
const LOGO_SIZE_PX = 80; // Branded logo size
const FALLBACK_BRAND_COLOR_HEX = '#6E56CF'; // Fallback brand color if theme is unavailable

interface BrandedLoaderProps {
  message?: string;
}

export const BrandedLoader = ({ message }: BrandedLoaderProps) => {
  const theme = useTheme();
  const float = useSharedValue(0);

  useEffect(() => {
    // Float animation between -FLOAT_AMPLITUDE_PX and +FLOAT_AMPLITUDE_PX on Y axis
    float.value = withRepeat(
      withTiming(1, { duration: FLOAT_CYCLE_DURATION_MS, easing: FLOAT_EASING }),
      FLOAT_REPEAT_INFINITE,
      true,
    );
  }, [float]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = float.value * FLOAT_AMPLITUDE_PX - FLOAT_VERTICAL_OFFSET_PX; // center around 0
    const scale = 1 + float.value * BREATHING_SCALE_FACTOR; // subtle scale breathing
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <YStack flex={1} items="center" justify="center" bg="$background" p="$6" gap="$4">
      <Animated.View style={animatedStyle}>
        <Logo
          width={LOGO_SIZE_PX}
          height={LOGO_SIZE_PX}
          color={
            (theme.accentColor?.get?.() as string | undefined) ||
            (theme.accent1?.get?.() as string | undefined) ||
            FALLBACK_BRAND_COLOR_HEX
          }
        />
      </Animated.View>
      {message ? (
        <Text color="$color8" text="center">
          {message}
        </Text>
      ) : null}
    </YStack>
  );
};
