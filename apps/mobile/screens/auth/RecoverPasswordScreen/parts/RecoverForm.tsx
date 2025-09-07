import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient, getAuthErrorMessage } from '@/lib/auth';
import {
  createRecoverFormSchema,
  recoverFormDefaultValues,
  type RecoverFormSchema,
} from '@/schemas/forms/auth/recoverForm.schema';
import { openEmailInbox } from '@/utils/openEmailInbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Spinner, Text, XStack, YStack } from 'tamagui';

export const RecoverForm = () => {
  const { t } = useTranslation([NAMESPACES.AUTH]);
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<RecoverFormSchema>({
    resolver: zodResolver(createRecoverFormSchema(t)),
    defaultValues: recoverFormDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: RecoverFormSchema) => {
    await authClient.forgetPassword(
      {
        email: data.email,
      },
      {
        onError: (error) => {
          const errorMessage = getAuthErrorMessage(error.error.code);
          toast.error(errorMessage);
          throw new Error(errorMessage);
        },
      },
    );
  };

  const handleOpenMail = async () => {
    await openEmailInbox();
  };

  if (isSubmitSuccessful) {
    return (
      <YStack gap="$4" items="center" justify="center" flex={1} width="100%">
        <YStack gap="$2" items="center">
          <Text fontSize="$7" fontWeight="800">
            {t(AuthTranslations.RECOVER_EMAIL_SENT_TITLE)}
          </Text>
          <Text color="$color" opacity={0.8} text="center">
            {t(AuthTranslations.RECOVER_EMAIL_SENT_DESCRIPTION)}
          </Text>
          <Text color="$color" opacity={0.6} fontSize="$2" text="center">
            {t(AuthTranslations.RECOVER_SPAM_NOTE)}
          </Text>
        </YStack>

        <YStack gap="$2" width="100%">
          <Button onPress={handleOpenMail} width="100%">
            {t(AuthTranslations.RECOVER_OPEN_EMAIL_APP)}
          </Button>
          <Link href="/(public)/sign-in" asChild>
            <Button
              variant="outline"
              width="100%"
              role="link"
              aria-label={t(AuthTranslations.RECOVER_BACK_TO_SIGN_IN)}
            >
              {t(AuthTranslations.RECOVER_BACK_TO_SIGN_IN)}
            </Button>
          </Link>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      <YStack gap="$1" items="center">
        <Text fontSize="$7" fontWeight="800">
          {t(AuthTranslations.RECOVER_TITLE)}
        </Text>
        <Text fontSize="$4" color="$color" opacity={0.7} text="center">
          {t(AuthTranslations.RECOVER_SUBTITLE)}
        </Text>
      </YStack>

      <YStack gap="$1.5">
        <Label htmlFor="recover-email">{t(AuthTranslations.EMAIL_LABEL)}</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              id="recover-email"
              value={value}
              onChangeText={onChange}
              placeholder={t(AuthTranslations.EMAIL_PLACEHOLDER)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              aria-invalid={!!errors.email?.message}
              {...field}
            />
          )}
        />
        {errors.email?.message && (
          <Text color="$red10" fontSize="$2">
            {errors.email.message}
          </Text>
        )}
        {!errors.email?.message && (
          <Text color="$color" opacity={0.6} fontSize="$2">
            {t(AuthTranslations.RECOVER_HELPER_NOTE)}
          </Text>
        )}
      </YStack>

      <XStack>
        <Button
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          aria-busy={isSubmitting}
          iconAfter={isSubmitting ? <Spinner size="small" /> : undefined}
          onPress={handleSubmit(onSubmit)}
          width="100%"
        >
          {isSubmitting
            ? t(AuthTranslations.RECOVER_SENDING)
            : t(AuthTranslations.RECOVER_SEND_LINK)}
        </Button>
      </XStack>
    </YStack>
  );
};
