import { OrSeparator } from '@/components/OrSeparator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import { AuthTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { authClient, getAuthErrorMessage } from '@/lib/auth';
import {
  signUpFormDefaultValues,
  signUpFormSchema,
  type SignUpFormSchema,
} from '@/schemas/forms/auth/signUpForm.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Spinner, Text, XStack, YStack } from 'tamagui';
import { SocialButtons } from '../../SocialButtons';

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const { success, error: toastError } = useToast();
  const { t } = useTranslation([NAMESPACES.AUTH, NAMESPACES.COMMON]);
  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signUpFormDefaultValues,
  });

  const handleEmailSignUp = async (data: SignUpFormSchema) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: `${data.firstName.trim().charAt(0).toUpperCase()}${data.firstName.trim().slice(1)} ${data.lastName.trim().charAt(0).toUpperCase()}${data.lastName.trim().slice(1)}`.trim(),
        },
        {
          onSuccess: () => {
            success(t(AuthTranslations.ACCOUNT_CREATED, { ns: NAMESPACES.AUTH }));
          },
          onError: (err) => {
            const errorMessage = getAuthErrorMessage(err.error.code);
            toastError(errorMessage);
          },
        },
      );
    });
  };

  return (
    <YStack gap="$3">
      <YStack gap="$1.5">
        {/* Name Section */}
        <YStack>
          <Label htmlFor="signup-firstName">Name</Label>
          <XStack gap="$2">
            <YStack flex={1}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    id="signup-firstName"
                    value={value}
                    onChangeText={onChange}
                    placeholder="John"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect={false}
                    {...field}
                  />
                )}
              />
              {errors.firstName?.message && (
                <Text color="$red10" fontSize="$2">
                  {errors.firstName.message}
                </Text>
              )}
            </YStack>

            <YStack flex={1}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="signup-lastName"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Smith"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.lastName?.message && (
                <Text color="$red10" fontSize="$2">
                  {errors.lastName.message}
                </Text>
              )}
            </YStack>
          </XStack>
        </YStack>

        {/* Email Field */}
        <YStack>
          <Label htmlFor="signup-email">Email</Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                id="signup-email"
                value={value}
                onChangeText={onChange}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            )}
          />
          {errors.email?.message && (
            <Text color="$red10" fontSize="$2">
              {errors.email.message}
            </Text>
          )}
        </YStack>

        {/* Password Field */}
        <YStack>
          <Label htmlFor="signup-password">Password</Label>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                id="signup-password"
                value={value}
                onChangeText={onChange}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            )}
          />
          {errors.password?.message && (
            <Text color="$red10" fontSize="$2">
              {errors.password.message}
            </Text>
          )}
        </YStack>

        {/* Confirm Password Field */}
        <YStack>
          <Label htmlFor="signup-confirmPassword">Repeat password</Label>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                id="signup-confirmPassword"
                value={value}
                onChangeText={onChange}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            )}
          />
          {errors.confirmPassword?.message && (
            <Text color="$red10" fontSize="$2">
              {errors.confirmPassword.message}
            </Text>
          )}
        </YStack>
      </YStack>

      <YStack gap="$1.5">
        <Button
          disabled={!isValid || isPending}
          aria-disabled={!isValid || isPending}
          aria-busy={isPending}
          aria-label={t(AuthTranslations.CREATE_ACCOUNT, {
            ns: NAMESPACES.AUTH,
          })}
          iconAfter={isPending ? <Spinner size="small" /> : undefined}
          animation="bouncy"
          pressStyle={{ scale: 0.97 }}
          onPress={handleSubmit(handleEmailSignUp)}
        >
          {isPending
            ? t(AuthTranslations.CREATING_ACCOUNT, { ns: NAMESPACES.AUTH })
            : t(AuthTranslations.CREATE_ACCOUNT, { ns: NAMESPACES.AUTH })}
        </Button>
        <OrSeparator />
        <SocialButtons disabled={isPending} />
      </YStack>

      <XStack justify="center" items="center" gap="$2" mt="$1">
        <Text fontSize="$4" color="$color" opacity={0.7}>
          {t(AuthTranslations.ALREADY_HAVE_ACCOUNT)}
        </Text>
        <Link href="/(public)/sign-in" asChild>
          <Text
            fontSize="$4"
            fontWeight="600"
            color="$accentColor"
            textDecorationLine="underline"
            pressStyle={{ opacity: 0.7 }}
          >
            {t(AuthTranslations.SIGN_IN)}
          </Text>
        </Link>
      </XStack>
    </YStack>
  );
};
