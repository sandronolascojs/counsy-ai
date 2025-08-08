import { ChatSheet } from '@/components/ChatSheet';
import { MicFab } from '@/components/MicFab';
import { TabBarBackground } from '@/components/TabBarBackground';
import {
  Home as HomeIcon,
  MessageSquare as MessageSquareIcon,
  Sparkles as SparklesIcon,
  User as UserIcon,
} from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => <TabBarBackground />,
          tabBarActiveTintColor: theme.accentColor?.get(),
          tabBarInactiveTintColor: theme.textSecondary?.get(),
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
            title: 'Home',
            tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />, // Home
          }}
        />
        <Tabs.Screen
          name="chats/index"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => <MessageSquareIcon size={24} color={color} />, // Chats
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
            title: 'Insights',
            tabBarIcon: ({ color }) => <SparklesIcon size={24} color={color} />, // Insights
          }}
        />
        <Tabs.Screen
          name="account/index"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />, // Account
          }}
        />
      </Tabs>
      <ChatSheet />
    </>
  );
}
