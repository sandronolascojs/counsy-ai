import { DangerTranslations, NAMESPACES } from '@/i18n/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

export default function AccountDangerScreen() {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);

  const dangerItems = [
    {
      key: 'delete_data',
      label: t(DangerTranslations.DELETE_DATA_LABEL),
      description: t(DangerTranslations.DELETE_DATA_DESCRIPTION),
    },
    {
      key: 'pause_account',
      label: t(DangerTranslations.PAUSE_ACCOUNT_LABEL),
      description: t(DangerTranslations.PAUSE_ACCOUNT_DESCRIPTION),
    },
    {
      key: 'delete_account',
      label: t(DangerTranslations.DELETE_ACCOUNT_LABEL),
      description: t(DangerTranslations.DELETE_ACCOUNT_DESCRIPTION),
    },
  ];

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" mb="$2" color="$red10">
            {t(DangerTranslations.TITLE)}
          </Text>
          <YStack rounded="$4" overflow="hidden" bg="$color2">
            {dangerItems.map((item, idx, arr) => (
              <XStack
                key={item.label}
                items="center"
                justify="space-between"
                py="$3"
                px="$4"
                borderBottomWidth={idx < arr.length - 1 ? 1 : 0}
                borderColor="$borderColor"
                bg="$red1"
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
