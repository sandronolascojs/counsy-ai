import { OrSeparator } from '@/components/OrSeparator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import { AuthTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient } from '@/lib/auth';
import {
  signInFormDefaultValues,
  signInFormSchema,
  type SignInFormSchema,
} from '@/schemas/forms/auth/signInForm.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Spinner, Text, XStack, YStack } from 'tamagui';
import { SocialButtons } from './SocialButtons';

export const EmailAuthForm = () => {
  const [isPending, startTransition] = useTransition();
  const { success, error: toastError } = useToast();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);
  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: signInFormDefaultValues,
    mode: 'onChange',
  });

  const handleEmailAuth = async (data: SignInFormSchema) => {
    startTransition(async () => {
      await authClient.signIn.email(
        { email: data.email, password: data.password },
        {
          onSuccess: () => {
            success('Welcome back', { message: 'Signed in successfully.' });
          },
          onError: (err) => {
            toastError(
              (err as { error?: { message?: string } })?.error?.message ||
                t(CommonTranslations.ERROR_GENERIC, { ns: NAMESPACES.COMMON }),
            );
          },
        },
      );
    });
  };

  return (
    <YStack gap="$4">
      <YStack>
        <YStack gap="$0.5">
          <Label htmlFor="email">{t(AuthTranslations.EMAIL_LABEL, { ns: NAMESPACES.AUTH })}</Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                id="email"
                value={value}
                onChangeText={onChange}
                placeholder={t(AuthTranslations.EMAIL_PLACEHOLDER, {
                  ns: NAMESPACES.AUTH,
                })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                {...field}
              />
            )}
          />
          {errors.email?.message && (
            <Text color="$red10" fontSize="$2">
              {errors.email.message}
            </Text>
          )}
        </YStack>

        <YStack gap="$0.5">
          <Label htmlFor="password">
            {t(AuthTranslations.PASSWORD_LABEL, { ns: NAMESPACES.AUTH })}
          </Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                id="password"
                value={value}
                onChangeText={onChange}
                placeholder={t(AuthTranslations.PASSWORD_PLACEHOLDER, {
                  ns: NAMESPACES.AUTH,
                })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
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
      </YStack>

      <YStack gap="$3">
        <Button
          disabled={!isValid || isPending}
          aria-disabled={!isValid || isPending}
          aria-busy={isPending}
          aria-label={t(AuthTranslations.SIGN_IN_WITH_EMAIL, {
            ns: NAMESPACES.AUTH,
          })}
          iconAfter={isPending ? <Spinner size="small" /> : undefined}
          animation="bouncy"
          pressStyle={{ scale: 0.97 }}
          onPress={handleSubmit(handleEmailAuth)}
        >
          {isPending
            ? t(AuthTranslations.SIGNING_IN, { ns: NAMESPACES.AUTH })
            : t(AuthTranslations.SIGN_IN, { ns: NAMESPACES.AUTH })}
        </Button>
        <OrSeparator />
        <SocialButtons disabled={isPending} />
      </YStack>

      <XStack justify="center" items="center" gap="$2">
        <Text fontSize="$4" color="$color" opacity={0.7}>
          {t(AuthTranslations.DONT_HAVE_ACCOUNT)}
        </Text>
        <Link href="/(public)/sign-up" asChild>
          <Text
            fontSize="$4"
            fontWeight="600"
            color="$accentColor"
            textDecorationLine="underline"
            pressStyle={{ opacity: 0.7 }}
          >
            {t(AuthTranslations.SIGN_UP)}
          </Text>
        </Link>
      </XStack>
    </YStack>
  );
};
