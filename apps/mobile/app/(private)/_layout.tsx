import { BrandedLoader } from '@/components/BrandedLoader';
import { ChatSheet } from '@/components/ChatSheet';
import { MicFab } from '@/components/MicFab';
import { TabBarBackground } from '@/components/TabBarBackground';
import { useAuthNavigationGuard } from '@/hooks/useAuthNavigationGuard';
import { NAMESPACES, NavigationTranslations } from '@/i18n/constants';
import { authClient } from '@/lib/auth';
import {
  Home as HomeIcon,
  MessageSquare as MessageSquareIcon,
  Sparkles as SparklesIcon,
  User as UserIcon,
} from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, type ColorTokens } from 'tamagui';

export default function TabLayout() {
  const theme = useTheme();
  const { data: session } = authClient.useSession();
  const { t } = useTranslation(NAMESPACES.NAVIGATION);
  const { isBlocking } = useAuthNavigationGuard({ mode: 'private' });

  if (isBlocking || !session?.user) {
    return <BrandedLoader message="Loading your space..." />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarBackground: () => <TabBarBackground />,
          tabBarActiveTintColor: theme.accentColor?.get(),
          tabBarInactiveTintColor: theme.color7?.get(),
          tabBarStyle: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            borderTopWidth: 0.2,
            borderTopColor: theme.borderColor?.get(),
            backgroundColor: 'transparent',
            bottom: 0,
            elevation: 0,
            paddingTop: 12,
            boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.05)',
          },
          tabBarItemStyle: {},
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t(NavigationTranslations.HOME),
            tabBarIcon: ({ color }) => <HomeIcon size={24} color={color as ColorTokens} />,
          }}
        />
        <Tabs.Screen
          name="chats/index"
          options={{
            title: t(NavigationTranslations.CHATS),
            tabBarIcon: ({ color }) => <MessageSquareIcon size={24} color={color as ColorTokens} />,
          }}
        />
        <Tabs.Screen
          name="mic/index"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => null,
            tabBarButton: () => <MicFab />,
          }}
        />
        <Tabs.Screen
          name="insights/index"
          options={{
            title: t(NavigationTranslations.INSIGHTS),
            tabBarIcon: ({ color }) => <SparklesIcon size={24} color={color as ColorTokens} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: t(NavigationTranslations.ACCOUNT),
            tabBarIcon: ({ color }) => <UserIcon size={24} color={color as ColorTokens} />,
          }}
        />
      </Tabs>
      <ChatSheet />
    </>
  );
}
