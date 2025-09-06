import { KeyboardAvoidingWrapper } from '@/components/KeyboardAvoidingWrapper';
import { Button } from '@/components/ui/Button';
import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Text, useTheme, XStack, YStack } from 'tamagui';
import { ResetForm } from './parts/ResetForm';

export const ResetPasswordScreenView = () => {
  const theme = useTheme();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} bg="$background" p="$6" gap="$5" justify="space-between">
          <XStack items="center">
            <Link href="/(public)/sign-in" asChild>
              <Button
                variant="ghost"
                role="link"
                aria-label="Go back"
                icon={<Feather name="chevron-left" size={20} color={theme.color.get()} />}
              >
                <Text fontSize="$4" fontWeight="600">
                  {t(AuthTranslations.RECOVER_BACK_TO_SIGN_IN)}
                </Text>
              </Button>
            </Link>
          </XStack>

          <YStack flex={1} justify="center">
            <ResetForm />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
};
