import React from 'react';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';

export default function AccountSecurityScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" marginBottom="$2">
            Security
          </Text>
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
            {[
              { label: 'Two-Factor Authentication', description: 'Enhance account security' },
              { label: 'Manage Devices', description: 'View and manage logged-in devices' },
              { label: 'Session History', description: 'See recent account activity' },
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
              </XStack>
            ))}
          </YStack>
        </YStack>
        <Separator />
      </YStack>
    </ScrollView>
  );
}
