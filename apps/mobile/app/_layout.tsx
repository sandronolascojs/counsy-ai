import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import config from '@/tamagui.config';
import { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
import { i18n, initializeI18n, useCurrentLanguage } from '../i18n';

const FONTS = {
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const effectiveScheme = colorScheme ?? 'dark';
  const language = useCurrentLanguage();
  const prevLanguageRef = useRef(language);

  // Update language only when it actually changes
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      initializeI18n(language);
      prevLanguageRef.current = language;
    }
  }, [language]);

  const [fontsLoaded] = useFonts(FONTS);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <TamaguiProvider config={config} defaultTheme={effectiveScheme}>
        <Theme name={effectiveScheme}>
          <YStack flex={1} backgroundColor="$background">
            <SafeAreaView style={{ flex: 1 }}>
              <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </ThemeProvider>
            </SafeAreaView>
          </YStack>
        </Theme>
      </TamaguiProvider>
    </I18nextProvider>
  );
}
