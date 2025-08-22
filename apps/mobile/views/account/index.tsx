import { Button } from '@/components/ui/Button';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import {
  NAMESPACES,
  AccountTranslations,
  AccountOverviewTranslations,
} from '@/i18n/constants';
import { APP_CONFIG } from '@/config/env.config';

interface SettingsSectionItem {
  label: string;
  description?: string;
  right?: React.ReactNode;
  isDanger?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsSectionItem[];
}

export const AccountSettingsView = () => {
  const { t } = useTranslation(NAMESPACES.ACCOUNT);

  const settingsSections: SettingsSection[] = [
    {
      title: t(AccountTranslations.TITLE),
      items: [
        {
          label: t('overview.open') + ' ' + t(AccountTranslations.TITLE),
          description: t('overview.account.description'),
          right: (
            <Link href="/(tabs)/account/account" asChild>
              <Text color="$accentColor" fontWeight="700">
                {t(AccountOverviewTranslations.OPEN)}
              </Text>
            </Link>
          ),
        },
      ],
    },
    {
      title: t('security.title'),
      items: [
        {
          label: t(AccountOverviewTranslations.OPEN) + ' ' + t('security.title'),
          description: t('overview.security.description'),
          right: (
            <Link href="/(tabs)/account/security" asChild>
              <Text color="$accentColor" fontWeight="700">
                {t(AccountOverviewTranslations.OPEN)}
              </Text>
            </Link>
          ),
        },
      ],
    },
    {
      title: t('preferences.title'),
      items: [
        {
          label: t(AccountOverviewTranslations.OPEN) + ' ' + t('preferences.title'),
          description: t('overview.preferences.description'),
          right: (
            <Link href="/(tabs)/account/preferences" asChild>
              <Text color="$accentColor" fontWeight="700">
                {t(AccountOverviewTranslations.OPEN)}
              </Text>
            </Link>
          ),
        },
      ],
    },
    {
      title: t('danger.title'),
      items: [
        {
          label: t(AccountOverviewTranslations.OPEN) + ' ' + t('danger.title'),
          description: t('overview.danger.description'),
          isDanger: true,
          right: (
            <Link href="/(tabs)/account/danger" asChild>
              <Text color="$red10" fontWeight="700">
                {t(AccountOverviewTranslations.OPEN)}
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
        <Text fontSize="$2" color="$color8">
          {t(AccountOverviewTranslations.APP_VERSION, { version: APP_CONFIG.basics.version })}
        </Text>
        <Separator marginVertical="$4" />
        <Button variant="outline">{t(AccountOverviewTranslations.LOGOUT)}</Button>
      </YStack>
    </ScrollView>
  );
};

export default AccountSettingsView;
