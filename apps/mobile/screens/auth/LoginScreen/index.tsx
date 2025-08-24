import Logo from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from 'react-native';
import { Separator, Text, useTheme, XStack, YStack } from 'tamagui';
import { EmailAuthForm } from './parts/EmailAuthForm';
import { LegalFooter } from './parts/LegalFooter';
import { SocialButtons } from './parts/SocialButtons';

export const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const effectiveScheme = colorScheme ?? 'dark';
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);

  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);

  const handleShowEmailForm = useCallback(() => {
    setShowEmailForm(true);
  }, []);

  const handleHideEmailForm = useCallback(() => {
    setShowEmailForm(false);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="scrollbar"
      >
        <YStack flex={1} bg="$background" p="$6" gap="$6" justify="space-between">
          <YStack gap="$2" mt="$6" items="center">
            <Logo width={96} height={96} color={theme.accent1.get()} />
            <Text fontSize="$9" fontWeight="800" mt="$3">
              {t(AuthTranslations.WELCOME_TITLE)}
            </Text>
            <Text fontSize="$5" color="$color" opacity={0.7} text="center">
              {t(AuthTranslations.WELCOME_SUBTITLE)}
            </Text>
          </YStack>

          <YStack gap="$3">
            {showEmailForm ? (
              <EmailAuthForm onBack={handleHideEmailForm} />
            ) : (
              <>
                <SocialButtons effectiveScheme={effectiveScheme} />
                <Button onPress={handleShowEmailForm} aria-label="Continue with email">
                  {t(AuthTranslations.CONTINUE_WITH_EMAIL)}
                </Button>
                <XStack items="center" justify="center">
                  <Link href="/(public)/sign-up">
                    <Text textDecorationLine="underline">Sign up</Text>
                  </Link>
                </XStack>
              </>
            )}
          </YStack>

          <LegalFooter />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
