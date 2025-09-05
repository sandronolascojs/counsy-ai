import { useAuthNavigationGuard } from '@/hooks/useAuthNavigationGuard';
import { Stack } from 'expo-router';

export default function PublicLayout() {
  useAuthNavigationGuard({ mode: 'public' });
  return (
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
  );
}
