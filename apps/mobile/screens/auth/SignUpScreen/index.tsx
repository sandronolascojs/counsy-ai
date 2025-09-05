import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, YStack } from 'tamagui';
import { LegalFooter } from '../LegalFooter';
import { SignUpForm } from './parts/SignUpForm';

export const SignUpScreenView = () => {
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
      >
        <YStack flex={1} bg="$background" p="$6" justify="space-between">
          <YStack gap="$1">
            <Text fontSize="$8" fontWeight="600">
              {t(AuthTranslations.CREATE_ACCOUNT)}
            </Text>
          </YStack>

          <SignUpForm />

          <LegalFooter />
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
