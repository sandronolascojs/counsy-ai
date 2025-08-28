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
import { SizableText, useTheme, useThemeName, XStack, YStack } from 'tamagui';

export type ToastPreset = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ShowToastOptions {
  message?: string;
  preset?: ToastPreset;
  duration?: number;
}

export interface UseToastApi {
  show: (title: string, opts?: ShowToastOptions) => boolean;
  success: (title: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  error: (title: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  info: (title: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
  warning: (title: string, opts?: Omit<ShowToastOptions, 'preset'>) => boolean;
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

export const useToast = (): UseToastApi => {
  const controller = useToastController();

  const show = (title: string, opts?: ShowToastOptions) => {
    const shown = controller.show(title, {
      message: opts?.message,
      customData: {
        themeName: mapPresetToTheme(opts?.preset),
      },
      duration: opts?.duration ?? 4000,
    });
    return shown;
  };

  const success: UseToastApi['success'] = (title, opts) =>
    show(title, { ...opts, preset: 'success' });
  const error: UseToastApi['error'] = (title, opts) => show(title, { ...opts, preset: 'error' });
  const info: UseToastApi['info'] = (title, opts) => show(title, { ...opts, preset: 'info' });
  const warning: UseToastApi['warning'] = (title, opts) =>
    show(title, { ...opts, preset: 'warning' });

  const hide = () => controller.hide();

  return { show, success, error, info, warning, hide };
};

export const Toaster = () => {
  const current = useToastState();
  const theme = useThemeName();

  return (
    <>
      {!!current && (
        <TamaguiToast key={current.id} duration={current.duration} theme={theme}>
          <YStack gap="$1" p="$2">
            <TamaguiToast.Title>
              <SizableText fontWeight="700">{current.title}</SizableText>
            </TamaguiToast.Title>
            {!!current.message && (
              <TamaguiToast.Description>
                <SizableText color="$color10">{current.message}</SizableText>
              </TamaguiToast.Description>
            )}
            <XStack justify="flex-end">
              <TamaguiToast.Close />
            </XStack>
          </YStack>
        </TamaguiToast>
      )}
      <SafeToastViewport />
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
