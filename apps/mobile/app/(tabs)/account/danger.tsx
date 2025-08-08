import React from 'react';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

export default function AccountDangerScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" marginBottom="$2" color="$red10">
            Danger Zone
          </Text>
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
            {[
              { label: 'Delete Chats & Data', description: 'Remove all chat history' },
              { label: 'Pause Account', description: 'Temporarily disable your account' },
              { label: 'Delete Account', description: 'Permanently delete your account' },
            ].map((item, idx, arr) => (
              <XStack
                key={item.label}
                alignItems="center"
                justifyContent="space-between"
                paddingVertical="$3"
                paddingHorizontal="$4"
                borderBottomWidth={idx < arr.length - 1 ? 1 : 0}
                borderColor="$borderColor"
                backgroundColor="$red1"
              >
                <YStack>
                  <Text fontWeight="700" color="$red10">
                    {item.label}
                  </Text>
                  <Text color="$red9" fontSize="$2">
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
