import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AccountOverviewTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient } from '@/lib/auth';
import { mobileLogger } from '@/utils/logger';
import { APP_CONFIG } from '@counsy-ai/types';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Separator, Text, XStack, YStack } from 'tamagui';

interface SettingsSection {
  title: string;
  items: {
    label: string;
    description?: string;
    onPress?: () => void;
    right?: React.ReactNode;
    isDanger?: boolean;
  }[];
}

export const AccountSettingsView = () => {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.ACCOUNT]);

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut();
      router.replace('/(public)/sign-in');
    } catch (error) {
      mobileLogger.error('Failed to sign out', {
        screen: 'AccountSettings',
        event: 'logout',
        error,
      });
      toast.error(t(CommonTranslations.ERROR_LOGOUT_FAILED));
    }
  }, [router, toast, t]);

  const settingsSections: SettingsSection[] = useMemo(
    () => [
      {
        title: t('account.title', { ns: NAMESPACES.ACCOUNT }),
        items: [
          {
            label: t('overview.open', { ns: NAMESPACES.ACCOUNT }),
            description: t('overview.account.description', { ns: NAMESPACES.ACCOUNT }),
            right: (
              <Link href="/(private)/account/details" asChild>
                <Text color="$accentColor" fontWeight="700">
                  {t(AccountOverviewTranslations.OPEN, { ns: NAMESPACES.ACCOUNT })}
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: t('security.title', { ns: NAMESPACES.ACCOUNT }),
        items: [
          {
            label: t('overview.open', { ns: NAMESPACES.ACCOUNT }),
            description: t('overview.security.description', { ns: NAMESPACES.ACCOUNT }),
            onPress: undefined,
            right: (
              <Link href="/(private)/account/security" asChild>
                <Text color="$accentColor" fontWeight="700">
                  {t(AccountOverviewTranslations.OPEN, { ns: NAMESPACES.ACCOUNT })}
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: t('preferences.title', { ns: NAMESPACES.ACCOUNT }),
        items: [
          {
            label: t('overview.open', { ns: NAMESPACES.ACCOUNT }),
            description: t('overview.preferences.description', { ns: NAMESPACES.ACCOUNT }),
            right: (
              <Link href="/(private)/account/preferences" asChild>
                <Text color="$accentColor" fontWeight="700">
                  {t(AccountOverviewTranslations.OPEN, { ns: NAMESPACES.ACCOUNT })}
                </Text>
              </Link>
            ),
          },
        ],
      },
      {
        title: t('danger.title', { ns: NAMESPACES.ACCOUNT }),
        items: [
          {
            label: t('overview.open', { ns: NAMESPACES.ACCOUNT }),
            description: t('overview.danger.description', { ns: NAMESPACES.ACCOUNT }),
            isDanger: true,
            right: (
              <Link href="/(private)/account/danger" asChild>
                <Text color="$red10" fontWeight="700">
                  {t(AccountOverviewTranslations.OPEN, { ns: NAMESPACES.ACCOUNT })}
                </Text>
              </Link>
            ),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <ScrollView flex={1} bg="$background" p="$4">
      <YStack gap="$6" pb={100}>
        {settingsSections.map((section) => (
          <YStack key={section.title}>
            <Text fontWeight="700" fontSize="$6" mb="$2">
              {section.title}
            </Text>
            <YStack rounded="$4" overflow="hidden" bg="$color2">
              {section.items.map((item, idx) => (
                <XStack
                  key={item.label}
                  items="center"
                  justify="space-between"
                  py="$3"
                  px="$4"
                  borderBottomWidth={idx < section.items.length - 1 ? 1 : 0}
                  borderColor="$borderColor"
                  bg={item.isDanger ? '$red1' : 'transparent'}
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
        {/* app version */}
        <Text fontSize="$2" color="$color8">
          {t(AccountOverviewTranslations.APP_VERSION, {
            ns: NAMESPACES.ACCOUNT,
            version: APP_CONFIG.basics.version,
          })}
        </Text>
        <Separator my="$4" />
        <Button onPress={handleLogout}>
          {t(AccountOverviewTranslations.LOGOUT, { ns: NAMESPACES.ACCOUNT })}
        </Button>
      </YStack>
    </ScrollView>
  );
};

export default AccountSettingsView;
