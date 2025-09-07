import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import { env } from '@/config/env.config';
import { AuthErrorTranslations, AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient, getAuthErrorMessage } from '@/lib/auth';
import {
  createResetPasswordFormSchema,
  resetPasswordFormDefaultValues,
  type ResetPasswordFormSchema,
} from '@/schemas/forms/auth/resetPasswordForm.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Spinner, Text, XStack, YStack } from 'tamagui';

export const ResetForm = () => {
  const { t } = useTranslation([NAMESPACES.AUTH]);
  const params = useLocalSearchParams<{ token?: string }>();
  const token = typeof params.token === 'string' ? params.token : '';
  const router = useRouter();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(createResetPasswordFormSchema(t)),
    defaultValues: resetPasswordFormDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordFormSchema) => {
    if (!token) {
      toast.error(t(AuthErrorTranslations.INVALID_TOKEN));
      return;
    }
    await authClient.resetPassword(
      {
        newPassword: data.password,
        token,
      },
      {
        onSuccess: () => {
          toast.success(t(AuthTranslations.RESET_UPDATED_SUCCESS));
          router.replace('/(public)/sign-in');
        },
        onError: (error) => {
          const errorMessage = getAuthErrorMessage(error.error.code);
          toast.error(errorMessage);
          throw new Error(errorMessage);
        },
      },
    );
  };

  return (
    <YStack gap="$4">
      <YStack gap="$1" items="center">
        <Text fontSize="$7" fontWeight="800">
          {t(AuthTranslations.RESET_TITLE)}
        </Text>
        <Text fontSize="$4" color="$color" opacity={0.7} text="center">
          {t(AuthTranslations.RESET_SUBTITLE)}
        </Text>
      </YStack>

      <YStack gap="$1.5">
        <Label htmlFor="password">{t(AuthTranslations.PASSWORD_LABEL)}</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              id="password"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              aria-invalid={!!errors.password?.message}
              {...field}
            />
          )}
        />
        {errors.password?.message && (
          <Text color="$red10" fontSize="$2">
            {errors.password.message}
          </Text>
        )}
      </YStack>

      <YStack gap="$1.5">
        <Label htmlFor="confirmPassword">{t(AuthTranslations.CONFIRM_PASSWORD_LABEL)}</Label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value, ...field } }) => (
            <Input
              id="confirmPassword"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              aria-invalid={!!errors.confirmPassword?.message}
              {...field}
            />
          )}
        />
        {errors.confirmPassword?.message && (
          <Text color="$red10" fontSize="$2">
            {errors.confirmPassword.message}
          </Text>
        )}
      </YStack>

      <XStack>
        <Button
          disabled={isSubmitting || !isValid || !token}
          aria-disabled={isSubmitting || !isValid || !token}
          aria-busy={isSubmitting}
          iconAfter={isSubmitting ? <Spinner size="small" /> : undefined}
          onPress={handleSubmit(onSubmit)}
          width="100%"
        >
          {isSubmitting
            ? t(AuthTranslations.RESET_UPDATING)
            : t(AuthTranslations.RESET_UPDATE_PASSWORD)}
        </Button>
      </XStack>
    </YStack>
  );
};
