import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import config from '@/tamagui.config';
import { SafeAreaView } from 'react-native';
import { TamaguiProvider, Theme, YStack } from 'tamagui';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme ?? 'dark'}>
        <YStack flex={1} backgroundColor="$background">
          <SafeAreaView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </ThemeProvider>
          </SafeAreaView>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
