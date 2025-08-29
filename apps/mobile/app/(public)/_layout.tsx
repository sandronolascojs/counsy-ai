import { useAuthNavigationGuard } from '@/hooks/useAuthNavigationGuard';
import { Stack } from 'expo-router';

export default function PublicLayout() {
  useAuthNavigationGuard({ mode: 'public' });
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
      <Stack.Screen name="recover/index" options={{ title: 'Recover Password' }} />
      <Stack.Screen name="reset/index" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
