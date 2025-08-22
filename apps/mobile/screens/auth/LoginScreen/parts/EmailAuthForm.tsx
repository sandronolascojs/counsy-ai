import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { AuthTranslations, NAMESPACES, NavigationTranslations } from '@/i18n/constants';
import {
  signInFormDefaultValues,
  signInFormSchema,
  type SignInFormSchema,
} from '@/schemas/forms/auth/signInForm.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label, Spinner, Text, XStack, YStack } from 'tamagui';

interface Props {
  onBack: () => void;
}

export const EmailAuthForm = ({ onBack }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { signIn } = useEmailAuth();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.NAVIGATION]);

  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: signInFormDefaultValues,
    mode: 'onChange',
  });

  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
    setError,
  } = form;

  const handleEmailAuth = async (data: SignInFormSchema) => {
    startTransition(async () => {
      const result = await signIn(data);

      if (result?.error) {
        setError('root', {
          type: 'manual',
          message: result.error,
        });
      }
    });
  };

  return (
    <YStack gap="$4">
      {errors.root?.message && (
        <YStack background="$red2" rounded="$4" p="$3" borderColor="$red10" borderWidth={1}>
          <Text color="$red10">{errors.root.message}</Text>
        </YStack>
      )}

      <YStack gap="$4">
        <YStack gap="$2">
          <Label htmlFor="email">{t(AuthTranslations.EMAIL_LABEL, { ns: NAMESPACES.AUTH })}</Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, ...field } }) => (
              <FormInput
                id="email"
                icon="mail"
                value={value}
                onChangeText={onChange}
                placeholder={t(AuthTranslations.EMAIL_PLACEHOLDER, { ns: NAMESPACES.AUTH })}
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

        <YStack gap="$2">
          <Label htmlFor="password">
            {t(AuthTranslations.PASSWORD_LABEL, { ns: NAMESPACES.AUTH })}
          </Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, ...field } }) => (
              <FormInput
                id="password"
                icon="lock-closed"
                value={value}
                onChangeText={onChange}
                placeholder={t(AuthTranslations.PASSWORD_PLACEHOLDER, { ns: NAMESPACES.AUTH })}
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

        <XStack gap="$2" justify="flex-end">
          <Button variant="outline" onPress={onBack} disabled={isPending}>
            {t(NavigationTranslations.BACK, { ns: NAMESPACES.NAVIGATION })}
          </Button>
          <Button
            disabled={!isValid || isPending}
            aria-disabled={!isValid || isPending}
            aria-busy={isPending}
            aria-label={t(AuthTranslations.SIGN_IN_WITH_EMAIL, { ns: NAMESPACES.AUTH })}
            iconAfter={isPending ? <Spinner size="small" /> : undefined}
            animation="bouncy"
            pressStyle={{ scale: 0.97 }}
            onPress={handleSubmit(handleEmailAuth)}
          >
            {isPending
              ? t(AuthTranslations.SIGNING_IN, { ns: NAMESPACES.AUTH })
              : t(AuthTranslations.SIGN_IN, { ns: NAMESPACES.AUTH })}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default EmailAuthForm;
