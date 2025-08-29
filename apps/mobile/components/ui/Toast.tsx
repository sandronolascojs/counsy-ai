import { AlertTriangle, CheckCircle2, Info, XCircle, X as XIcon } from '@tamagui/lucide-icons';
import {
  Toast as TamaguiToast,
  ToastProvider as TamaguiToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast';
import React from 'react';
import { NativeModules, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SizableText, useThemeName, XStack, YStack } from 'tamagui';

export type ToastPreset = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ShowToastOptions {
  preset?: ToastPreset;
  duration?: number;
}

export interface UseToastApi {
  show: (message: string, opts?: ShowToastOptions) => boolean;
  success: (message: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  error: (message: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  info: (message: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  warning: (message: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  hide: () => void;
}

const mapPresetToTheme = (preset?: ToastPreset): string | undefined => {
  switch (preset) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'accent';
    default:
      return undefined;
  }
};

// Note: We keep only theme mapping to allow preset theming when desired
const mapPresetToIcon = (preset?: ToastPreset): typeof CheckCircle2 | undefined => {
  switch (preset) {
    case 'success':
      return CheckCircle2;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return XCircle;
    default:
      return Info;
  }
};

const mapPresetToColorToken = (preset?: ToastPreset) => {
  switch (preset) {
    case 'success':
      return '$green10';
    case 'warning':
      return '$yellow10';
    case 'error':
      return '$red10';
    default:
      return '$accentColor';
  }
};

export const useToast = (): UseToastApi => {
  const controller = useToastController();

  const show = (message: string, opts?: ShowToastOptions) => {
    const shown = controller.show(message, {
      message,
      customData: {
        themeName: mapPresetToTheme(opts?.preset),
        preset: opts?.preset ?? 'default',
      },
      duration: opts?.duration ?? 4000,
    });
    return shown;
  };

  const success: UseToastApi['success'] = (message, opts) =>
    show(message, { ...opts, preset: 'success' });
  const error: UseToastApi['error'] = (message, opts) =>
    show(message, { ...opts, preset: 'error' });
  const info: UseToastApi['info'] = (message, opts) => show(message, { ...opts, preset: 'info' });
  const warning: UseToastApi['warning'] = (message, opts) =>
    show(message, { ...opts, preset: 'warning' });

  const hide = () => controller.hide();

  return { show, success, error, info, warning, hide };
};

export const Toaster = () => {
  const current = useToastState();
  const theme = useThemeName();

  // Compute visual props outside JSX for clarity
  const preset = current?.customData?.preset as ToastPreset | undefined;
  const IconComponent = mapPresetToIcon(preset);
  const iconColor = mapPresetToColorToken(preset);
  const themeName = current?.customData?.themeName ?? theme;

  return (
    <>
      {!!current && (
        <YStack items="center" px="$3">
          <TamaguiToast
            key={current.id}
            duration={current.duration}
            theme={themeName}
            bg="$background"
            rounded="$4"
            borderWidth={1}
            borderColor="$borderColor"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.25}
            shadowRadius={3.84}
            elevation={5}
            p="$2"
            width="auto"
            maxW="95%"
          >
            <XStack items="center" gap="$3">
              {IconComponent ? <IconComponent size={20} color={iconColor} /> : null}
              <YStack shrink={1}>
                <SizableText
                  color="$color"
                  fontSize="$4"
                  fontWeight="500"
                  aria-label="Toast message"
                >
                  {current.message}
                </SizableText>
              </YStack>
              <TamaguiToast.Close aria-label="Close notification" ml="auto">
                <YStack
                  width={20}
                  height={20}
                  items="center"
                  justify="center"
                  rounded="$10"
                  hoverStyle={{ opacity: 0.8 }}
                >
                  <XIcon size={18} color="$color" />
                </YStack>
              </TamaguiToast.Close>
            </XStack>
          </TamaguiToast>
        </YStack>
      )}
    </>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const hasNativeBurnt = Platform.OS !== 'web' && Boolean(NativeModules?.Burnt);
  return (
    <TamaguiToastProvider
      native={hasNativeBurnt}
      burntOptions={hasNativeBurnt ? { from: 'top' } : undefined}
    >
      {children}
      <Toaster />
      <SafeToastViewport />
    </TamaguiToastProvider>
  );
};

export default ToastProvider;

export const SafeToastViewport = () => {
  const { left, top, right } = useSafeAreaInsets();
  return <ToastViewport flexDirection="column-reverse" top={top} left={left} right={right} />;
};
