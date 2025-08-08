import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import config from '@/tamagui.config';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
import { i18n, initializeI18n, useCurrentLanguage } from '../i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const effectiveScheme = colorScheme ?? 'dark';
  const language = useCurrentLanguage();

  // Initialize i18n with the detected language
  initializeI18n(language);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
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
