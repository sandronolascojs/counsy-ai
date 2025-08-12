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
      right: <Switch checked={darkMode} onCheckedChange={setDarkMode} />,
    },
    {
      key: 'cloud_sync',
      label: t(PreferencesTranslations.CLOUD_SYNC_LABEL),
      description: t(PreferencesTranslations.CLOUD_SYNC_DESCRIPTION),
      right: <Switch checked={cloudSync} onCheckedChange={setCloudSync} />,
    },
  ];

  return (
    <ScrollView flex={1} backgroundColor="$background" padding="$4">
      <YStack gap="$6" paddingBottom={100}>
        <YStack>
          <Text fontWeight="700" fontSize="$6" marginBottom="$2">
            {t(PreferencesTranslations.TITLE)}
          </Text>
          <YStack borderRadius="$4" overflow="hidden" backgroundColor="$color2">
            {preferenceItems.map((item, idx, arr) => (
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
