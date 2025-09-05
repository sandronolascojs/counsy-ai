import { useAuthNavigationGuard } from '@/hooks/useAuthNavigationGuard';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicLayout() {
  useAuthNavigationGuard({ mode: 'public' });
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: 'transparent' },
          headerShown: false,
        }}
      >
        <Stack.Screen name="sign-in/index" />
        <Stack.Screen name="sign-up/index" />
        <Stack.Screen name="recover/index" />
        <Stack.Screen name="reset/index" />
      </Stack>
    </SafeAreaView>
  );
}
