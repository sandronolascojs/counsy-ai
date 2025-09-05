import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/ui/Toast';
import config from '@/tamagui.config';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
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
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme={effectiveScheme}>
          <Theme name={effectiveScheme}>
            {fontsLoaded ? (
              <ErrorBoundary>
                <ToastProvider>
                  <YStack flex={1} bg="$background">
                    <SafeAreaView style={{ flex: 1 }}>
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
                    </SafeAreaView>
                  </YStack>
                </ToastProvider>
              </ErrorBoundary>
            ) : (
              <BrandedLoader message="Preparing your experience..." />
            )}
          </Theme>
        </TamaguiProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
};

export default RootLayout;
