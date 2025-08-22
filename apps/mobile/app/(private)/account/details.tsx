import { AccountTranslations, NAMESPACES } from '@/i18n/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

export default function AccountDetailsScreen() {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);

  const accountItems = [
    {
      key: 'change_name',
      label: t(AccountTranslations.CHANGE_NAME_LABEL),
      description: t(AccountTranslations.CHANGE_NAME_DESCRIPTION),
    },
    {
      key: 'change_email',
      label: t(AccountTranslations.CHANGE_EMAIL_LABEL),
      description: t(AccountTranslations.CHANGE_EMAIL_DESCRIPTION),
    },
    {
      key: 'change_password',
      label: t(AccountTranslations.CHANGE_PASSWORD_LABEL),
      description: t(AccountTranslations.CHANGE_PASSWORD_DESCRIPTION),
    },
    {
      key: 'language',
      label: t(AccountTranslations.LANGUAGE_LABEL),
      description: t(AccountTranslations.LANGUAGE_DESCRIPTION),
    },
  ];

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" mb="$2">
            {t(AccountTranslations.TITLE)}
          </Text>
          <YStack rounded="$4" overflow="hidden" bg="$color2">
            {accountItems.map((item, idx, arr) => (
              <XStack
                key={item.label}
                items="center"
                justify="space-between"
                py="$3"
                px="$4"
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
