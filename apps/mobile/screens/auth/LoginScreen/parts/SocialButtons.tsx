import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { env } from '@/config/env.config';
import { AuthTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient } from '@/lib/auth';
import { APP_CONFIG } from '@counsy-ai/types';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Separator, Text, useTheme, XStack, YStack } from 'tamagui';

interface Props {
  effectiveScheme: 'light' | 'dark';
  disabled?: boolean;
}

export const SocialButtons = ({ effectiveScheme, disabled = false }: Props) => {
  const theme = useTheme();
  const { error } = useToast();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setIsAuthorizing(true);
    const scheme =
      env.EXPO_PUBLIC_APP_ENV === 'production'
        ? APP_CONFIG.basics.prefix
        : `${APP_CONFIG.basics.prefix}-${env.EXPO_PUBLIC_APP_ENV}`;
    const callbackURL = Linking.createURL('/', { scheme });
    await authClient.signIn.social(
      { provider: 'google', callbackURL },
      {
        onError: (e) => {
          error(e.error?.message || t(CommonTranslations.ERROR_GENERIC));
        },
      },
    );
  };

  const signInWithApple = async () => {
    setIsAuthorizing(true);
    const scheme =
      env.EXPO_PUBLIC_APP_ENV === 'production'
        ? APP_CONFIG.basics.prefix
        : `${APP_CONFIG.basics.prefix}-${env.EXPO_PUBLIC_APP_ENV}`;
    const callbackURL = Linking.createURL('/', { scheme });
    await authClient.signIn.social(
      { provider: 'apple', callbackURL },
      {
        onError: (e) => {
          error(e.error?.message || t(CommonTranslations.ERROR_GENERIC));
        },
      },
    );
  };

  return (
    <YStack gap="$3">
      <Button
        onPress={() => signInWithApple()}
        disabled={disabled || isAuthorizing}
        icon={
          <Ionicons
            name="logo-apple"
            size={20}
            color={effectiveScheme === 'dark' ? theme.color.get() : theme.color1.get()}
          />
        }
      >
        {t(AuthTranslations.CONTINUE_WITH_APPLE)}
      </Button>
      <Button
        onPress={() => signInWithGoogle()}
        disabled={disabled || isAuthorizing}
        icon={
          <Ionicons
            name="logo-google"
            size={20}
            color={effectiveScheme === 'dark' ? theme.color.get() : theme.color1.get()}
          />
        }
      >
        {t(AuthTranslations.CONTINUE_WITH_GOOGLE)}
      </Button>

      <XStack items="center" gap="$3">
        <Separator flex={1} />
        <Text color="$color" opacity={0.7}>
          {t(AuthTranslations.OR)}
        </Text>
        <Separator flex={1} />
      </XStack>
    </YStack>
  );
};
