import React from 'react';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

export default function AccountDetailsScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" marginBottom="$2">
            Account
          </Text>
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
            {[
              { label: 'Change Name', description: 'Update your display name' },
              { label: 'Change Email', description: 'Update your email address' },
              { label: 'Change Password', description: 'Update your password' },
              { label: 'Language', description: 'Select your preferred language' },
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
      </YStack>
    </ScrollView>
  );
}
