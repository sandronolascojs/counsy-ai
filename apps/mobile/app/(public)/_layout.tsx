import { authClient } from '@/lib/auth';
import { Redirect, Stack } from 'expo-router';

export default function PublicLayout() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (session?.user) return <Redirect href="/(private)" />;
  return (
    <Stack>
      <Stack.Screen name="sign-in/index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up/index" options={{ headerShown: false }} />
      <Stack.Screen name="recover/index" options={{ title: 'Recover Password' }} />
      <Stack.Screen name="reset/index" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
