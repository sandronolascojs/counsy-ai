import { NAMESPACES, PreferencesTranslations } from '@/i18n/constants';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Switch, Text, XStack, YStack } from 'tamagui';

export default function AccountPreferencesScreen() {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);
  const [darkMode, setDarkMode] = useState(false);
  const [cloudSync, setCloudSync] = useState(false);

  const preferenceItems = [
    {
      key: 'dark_mode',
      label: t(PreferencesTranslations.DARK_MODE_LABEL),
      description: t(PreferencesTranslations.DARK_MODE_DESCRIPTION),
      right: <Switch id="dark_mode" checked={darkMode} onCheckedChange={setDarkMode} />,
    },
    {
      key: 'cloud_sync',
      label: t(PreferencesTranslations.CLOUD_SYNC_LABEL),
      description: t(PreferencesTranslations.CLOUD_SYNC_DESCRIPTION),
      right: <Switch id="cloud_sync" checked={cloudSync} onCheckedChange={setCloudSync} />,
    },
  ];

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" mb="$2">
            {t(PreferencesTranslations.TITLE)}
          </Text>
          <YStack rounded="$4" overflow="hidden" bg="$color2">
            {preferenceItems.map((item, idx, arr) => (
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
                {item.right}
              </XStack>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
