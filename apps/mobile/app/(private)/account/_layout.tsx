import { Stack } from 'expo-router';

export default function AccountStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, headerBackTitle: 'Return' }} />
      <Stack.Screen name="details" options={{ title: 'Account', headerBackTitle: 'Return' }} />
      <Stack.Screen name="security" options={{ title: 'Security', headerBackTitle: 'Return' }} />
      <Stack.Screen
        name="preferences"
        options={{ title: 'Preferences', headerBackTitle: 'Return' }}
      />
      <Stack.Screen name="danger" options={{ title: 'Danger Zone', headerBackTitle: 'Return' }} />
    </Stack>
  );
}
