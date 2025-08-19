import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { env } from '@/config/env.config';
import { AuthTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient } from '@/lib/auth';
import { APP_CONFIG } from '@counsy-ai/types';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from 'react-native';
import { Separator, Text, useTheme, XStack, YStack } from 'tamagui';

export const LoginScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const { error } = useToast();
  const effectiveScheme = colorScheme ?? 'dark';
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);

  const handleGoogleSignIn = async () => {
    const scheme =
      env.EXPO_PUBLIC_APP_ENV === 'production'
        ? APP_CONFIG.basics.prefix
        : `${APP_CONFIG.basics.prefix}-${env.EXPO_PUBLIC_APP_ENV}`;
    const callbackURL = Linking.createURL('/', { scheme });

    await authClient.signIn.social(
      { provider: 'google', callbackURL },
      {
        onError: (err) => {
          error(err.error?.message || t(CommonTranslations.ERROR_GENERIC));
        },
      },
    );
  };

  const handleAppleSignIn = async () => {
    try {
      const scheme =
        env.EXPO_PUBLIC_APP_ENV === 'production'
          ? APP_CONFIG.basics.prefix
          : `${APP_CONFIG.basics.prefix}-${env.EXPO_PUBLIC_APP_ENV}`;
      const callbackURL = Linking.createURL('/', { scheme });

      await authClient.signIn.social({ provider: 'apple', callbackURL });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleEmailContinue = () => {
    router.push('/sign-in');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} bg="$background" p="$6" gap="$6" justify="space-between">
          {/* Top: Logo and headings */}
          <YStack gap="$2" mt="$6" items="center">
            <Logo width={96} height={96} color={theme.accent1.get()} />
            <Text fontSize="$9" fontWeight="800" mt="$3">
              {t(AuthTranslations.WELCOME_TITLE)}
            </Text>
            <Text fontSize="$5" color="$color" opacity={0.7}>
              {t(AuthTranslations.WELCOME_SUBTITLE)}
            </Text>
          </YStack>

          {/* Center: Auth Buttons */}
          <YStack gap="$3">
            <Button
              onPress={handleAppleSignIn}
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
              onPress={handleGoogleSignIn}
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

            <Button onPress={handleEmailContinue}>{t(AuthTranslations.CONTINUE_WITH_EMAIL)}</Button>
          </YStack>

          {/* Bottom: Legal and skip */}
          <YStack gap="$2" mb="$4" items="center">
            <Text color="$color" opacity={0.7}>
              {t(AuthTranslations.LEGAL_PREFIX)}{' '}
              <Link href="https://counsy.ai/terms" asChild>
                <Text textDecorationLine="underline">{t(AuthTranslations.TERMS)}</Text>
              </Link>{' '}
              {t(AuthTranslations.AND)}{' '}
              <Link href="https://counsy.ai/privacy" asChild>
                <Text textDecorationLine="underline">{t(AuthTranslations.PRIVACY)}</Text>
              </Link>
              .
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
