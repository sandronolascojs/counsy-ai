import { ChatSheet } from '@/components/ui/ChatSheet';
import { MicFab } from '@/components/ui/MicFab';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import {
  Book as BookIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  User as UserIcon,
} from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';

export default function TabLayout() {
  const theme = useTheme();
  console.log(theme);
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => <TabBarBackground />,
          tabBarActiveTintColor: theme.accentColor?.get(),
          tabBarIconStyle: {
            color: theme.borderColor?.get(),
          },
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
          name="history/index"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <HistoryIcon size={24} color={color} />, // History
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
          name="advice/index"
          options={{
            title: 'Tips',
            tabBarIcon: ({ color }) => <BookIcon size={24} color={color} />, // Tips
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
