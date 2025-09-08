import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient, getAuthErrorMessage } from '@/lib/auth';
import { APP_CONFIG } from '@counsy-ai/types';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, useColorScheme } from 'react-native';
import { useTheme, YStack } from 'tamagui';

interface Props {
  disabled?: boolean;
}

export const SocialButtons = ({ disabled = false }: Props) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const effectiveScheme = colorScheme ?? 'dark';
  const toast = useToast();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setIsAuthorizing(true);
    try {
      const scheme = APP_CONFIG.basics.prefix;
      const callbackURL = Linking.createURL('/', { scheme });
      await authClient.signIn.social(
        { provider: 'google', callbackURL },
        {
          onError: (e) => {
            console.error(e);
            const errorMessage = getAuthErrorMessage(e.error?.code);
            toast.error(errorMessage);
          },
        },
      );
    } finally {
      setIsAuthorizing(false);
    }
  };

  const signInWithApple = async () => {
    setIsAuthorizing(true);
    try {
      if (
        Platform.OS === 'ios' &&
        AppleAuthentication.isAvailableAsync &&
        (await AppleAuthentication.isAvailableAsync())
      ) {
        const cred = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const identityToken = cred?.identityToken;
        if (!identityToken) throw new Error('No identityToken from Apple');

        await authClient.signIn.social(
          { provider: 'apple', idToken: { token: identityToken } },
          {
            onError: (e) => {
              const errorMessage = getAuthErrorMessage(e.error?.code);
              toast.error(errorMessage);
            },
          },
        );
        return;
      }

      const scheme = APP_CONFIG.basics.prefix;
      const callbackURL = Linking.createURL('/', { scheme });
      await authClient.signIn.social(
        { provider: 'apple', callbackURL },
        {
          onError: (e) => {
            const errorMessage = getAuthErrorMessage(e.error?.code);
            toast.error(errorMessage);
          },
        },
      );
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <YStack gap="$3">
      {Platform.OS !== 'android' && (
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
      )}
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
    </YStack>
  );
};
