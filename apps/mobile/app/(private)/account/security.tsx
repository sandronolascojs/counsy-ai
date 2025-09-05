import { NAMESPACES, SecurityTranslations } from '@/i18n/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';

export default function AccountSecurityScreen() {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);

  const securityItems = [
    {
      key: 'two_factor',
      label: t(SecurityTranslations.TWO_FACTOR_LABEL),
      description: t(SecurityTranslations.TWO_FACTOR_DESCRIPTION),
    },
    {
      key: 'manage_devices',
      label: t(SecurityTranslations.MANAGE_DEVICES_LABEL),
      description: t(SecurityTranslations.MANAGE_DEVICES_DESCRIPTION),
    },
    {
      key: 'session_history',
      label: t(SecurityTranslations.SESSION_HISTORY_LABEL),
      description: t(SecurityTranslations.SESSION_HISTORY_DESCRIPTION),
    },
  ];

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" mb="$2">
            {t(SecurityTranslations.TITLE)}
          </Text>
          <YStack rounded="$4" overflow="hidden" bg="$color2">
            {securityItems.map((item, idx, arr) => (
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
        <Separator />
      </YStack>
    </ScrollView>
  );
}
