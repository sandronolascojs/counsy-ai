import { Button } from '@/components/ui/Button';
import { Link } from 'expo-router';
import React from 'react';
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
  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          label: 'Open Account',
          description: 'Profile and identity settings',
          right: (
            <Link href="/(private)/account/account" asChild>
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
  ];

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        {settingsSections.map((section) => (
          <YStack key={section.title}>
            <Text fontWeight="700" fontSize="$6" marginBottom="$2">
              {section.title}
            </Text>
            <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
              {section.items.map((item, idx) => (
                <XStack
                  key={item.label}
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical="$3"
                  paddingHorizontal="$4"
                  borderBottomWidth={idx < section.items.length - 1 ? 1 : 0}
                  borderColor="$borderColor"
                  backgroundColor={item.isDanger ? '$red1' : 'transparent'}
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
        <Separator marginVertical="$4" />
        <Button variant="outline">Logout</Button>
      </YStack>
    </ScrollView>
  );
};

export default AccountSettingsView;
