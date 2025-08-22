import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  NAMESPACES,
  NavigationTranslations,
  AccountTranslations,
  SecurityTranslations,
  PreferencesTranslations,
  DangerTranslations,
} from '@/i18n/constants';

export default function AccountStackLayout() {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);
  const { t: tNav } = useTranslation(NAMESPACES.NAVIGATION);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, headerBackTitle: tNav(NavigationTranslations.BACK) }} />
      <Stack.Screen name="account" options={{ title: t(AccountTranslations.TITLE), headerBackTitle: tNav(NavigationTranslations.BACK) }} />
      <Stack.Screen name="security" options={{ title: t(SecurityTranslations.TITLE), headerBackTitle: tNav(NavigationTranslations.BACK) }} />
      <Stack.Screen
        name="preferences"
        options={{ title: t(PreferencesTranslations.TITLE), headerBackTitle: tNav(NavigationTranslations.BACK) }}
      />
      <Stack.Screen name="danger" options={{ title: t(DangerTranslations.TITLE), headerBackTitle: tNav(NavigationTranslations.BACK) }} />
    </Stack>
  );
}
