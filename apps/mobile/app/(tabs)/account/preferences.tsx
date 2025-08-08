import React, { useState } from 'react';
import { ScrollView, Switch, Text, XStack, YStack } from 'tamagui';

export default function AccountPreferencesScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [cloudSync, setCloudSync] = useState(false);

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" marginBottom="$2">
            Preferences
          </Text>
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
            {[
              {
                label: 'Dark Mode',
                description: 'Toggle dark theme',
                right: <Switch checked={darkMode} onCheckedChange={setDarkMode} />,
              },
              {
                label: 'Cloud Sync',
                description: 'Enable encrypted chat sync',
                right: <Switch checked={cloudSync} onCheckedChange={setCloudSync} />,
              },
            ].map((item, idx, arr) => (
              <XStack
                key={item.label}
                alignItems="center"
                justifyContent="space-between"
                paddingVertical="$3"
                paddingHorizontal="$4"
                borderBottomWidth={idx < arr.length - 1 ? 1 : 0}
                borderColor="$borderColor"
              >
                <YStack>
                  <Text fontWeight="600">{item.label}</Text>
                  <Text color="$color8" fontSize="$2">
                    {item.description}
                  </Text>
                </YStack>
                {item.right}
              </XStack>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
