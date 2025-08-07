import { ChatSheet } from '@/components/ui/ChatSheet';
import { MicFab } from '@/components/ui/MicFab';
import { TabBarBackground } from '@/components/ui/TabBarBackground';
import {
  Book as BookIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Map as MapIcon,
} from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: TabBarBackground,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginBottom: 8,
          },
          tabBarStyle: {
            position: 'absolute',
            height: 84,
            borderTopWidth: 0,
            backgroundColor: 'transparent',
            bottom: 0,
          },
          tabBarItemStyle: {
            height: 64,
            paddingTop: 12,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color }) => <MapIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarLabel: 'History',
            tabBarIcon: ({ color }) => <HistoryIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="advice"
          options={{
            title: 'Tips',
            tabBarLabel: 'Tips',
            tabBarIcon: ({ color }) => <BookIcon size={24} color={color} />,
          }}
        />
      </Tabs>

      <MicFab />
      <ChatSheet />
    </>
  );
}
