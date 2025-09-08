import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { QueryClientProviderWrapper } from '@/components/QueryClientProviderWrapper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { ToastProvider } from '@/components/ui/Toast';
import config from '@/tamagui.config';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import { BrandedLoader } from '../components/BrandedLoader';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { i18n, initializeI18n, useCurrentLanguage } from '../i18n';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const effectiveScheme = colorScheme ?? 'dark';
  const language = useCurrentLanguage();

  // Ensure i18n reflects the current device-preferred language on mount and when it changes
  useEffect(() => {
    initializeI18n(language);
  }, [language]);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <I18nextProvider i18n={i18n}>
      <TamaguiProvider config={config} defaultTheme={effectiveScheme}>
        <Theme name={effectiveScheme}>
          <SafeAreaWrapper>
            {fontsLoaded ? (
              <ErrorBoundary>
                <ToastProvider>
                  <QueryClientProviderWrapper>
                    <Stack
                      screenOptions={{
                        animation: 'none',
                        contentStyle: { backgroundColor: 'transparent' },
                      }}
                    >
                      <Stack.Screen name="index" options={{ headerShown: false }} />
                      <Stack.Screen name="(public)" options={{ headerShown: false }} />
                      <Stack.Screen name="(private)" options={{ headerShown: false }} />
                    </Stack>
                  </QueryClientProviderWrapper>
                </ToastProvider>
              </ErrorBoundary>
            ) : (
              <BrandedLoader message="Preparing your experience..." />
            )}
          </SafeAreaWrapper>
        </Theme>
      </TamaguiProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
