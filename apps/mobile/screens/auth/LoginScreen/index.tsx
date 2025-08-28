import Logo from '@/components/Logo';
import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme, XStack, YStack } from 'tamagui';
import { EmailAuthForm } from './parts/EmailAuthForm';
import { LegalFooter } from './parts/LegalFooter';

export const LoginScreenView = () => {
  const theme = useTheme();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);

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
        <YStack flex={1} bg="$background" p="$6" justify="space-between">
          <YStack gap="$2" items="center">
            <Logo width={96} height={96} color={theme.accent1.get()} />
            <Text fontSize="$9" fontWeight="800" mt="$3">
              {t(AuthTranslations.WELCOME_TITLE)}
            </Text>
            <Text fontSize="$5" color="$color" opacity={0.7} text="center">
              {t(AuthTranslations.WELCOME_SUBTITLE)}
            </Text>
          </YStack>

          <EmailAuthForm />

          <LegalFooter />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
