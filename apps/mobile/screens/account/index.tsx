import { Button } from '@/components/ui/Button';
import { authClient } from '@/lib/auth';
import { APP_CONFIG } from '@counsy-ai/types';
import { Link } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';

interface SettingsSection {
  title: string;
  items: {
    label: string;
    description?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    isDanger?: boolean;
  }[];
}

export const AccountSettingsView = () => {
  const handleLogout = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const settingsSections: SettingsSection[] = useMemo(
    () => [
      {
        title: 'Account',
        items: [
          {
            label: 'Open Account',
            description: 'Profile and identity settings',
            right: (
              <Link href="/(private)/account/details" asChild>
                <Text color="$accentColor" fontWeight="700">
                  Open
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Security',
        items: [
          {
            label: 'Open Security',
            description: 'Review all security settings',
            onPress: undefined,
            right: (
              <Link href="/(private)/account/security" asChild>
                <Text color="$accentColor" fontWeight="700">
                  Open
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Preferences',
        items: [
          {
            label: 'Open Preferences',
            description: 'Theme and sync options',
            right: (
              <Link href="/(private)/account/preferences" asChild>
                <Text color="$accentColor" fontWeight="700">
                  Open
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: 'Danger Zone',
        items: [
          {
            label: 'Open Danger Zone',
            description: 'Sensitive destructive actions',
            isDanger: true,
            right: (
              <Link href="/(private)/account/danger" asChild>
                <Text color="$red10" fontWeight="700">
                  Open
                </Text>
              </Link>
            ),
          },
        ],
      },
    ],
    [],
  );

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        {settingsSections.map((section) => (
          <YStack key={section.title}>
            <Text fontWeight="700" fontSize="$6" mb="$2">
              {section.title}
            </Text>
            <YStack rounded="$4" overflow="hidden" bg="$color2">
              {section.items.map((item, idx) => (
                <XStack
                  key={item.label}
                  items="center"
                  justify="space-between"
                  py="$3"
                  px="$4"
                  borderBottomWidth={idx < section.items.length - 1 ? 1 : 0}
                  borderColor="$borderColor"
                  bg={item.isDanger ? '$red1' : 'transparent'}
                >
                  <YStack>
                    <Text color={item.isDanger ? '$red10' : '$color'} fontWeight="600">
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text color="$color8" fontSize="$2">
                        {item.description}
                      </Text>
                    )}
                  </YStack>
                  {item.right}
                </XStack>
              ))}
            </YStack>
          </YStack>
        ))}
        {/* app version */}
        <Text fontSize="$2" color="$color8">
          App version {APP_CONFIG.basics.version}
        </Text>
        <Separator my="$4" />
        <Button onPress={handleLogout}>Logout</Button>
      </YStack>
    </ScrollView>
  );
};

export default AccountSettingsView;
