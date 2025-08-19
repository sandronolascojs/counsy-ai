import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { authClient } from '@/lib/auth';
import {
  signUpFormDefaultValues,
  signUpFormSchema,
  type SignUpFormSchema,
} from '@/schemas/forms/auth/signUpForm.schema';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Form, Input, Label, Spinner, Text, XStack, YStack } from 'tamagui';

interface Props {}

export const SignUpScreen = ({}: Props) => {
  const { success, error } = useToast();
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signUpFormDefaultValues,
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState<boolean>(false);

  const canSubmit = useMemo(
    () => form.formState.isValid && !isSubmitting,
    [form.formState.isValid, isSubmitting],
  );

  const handleEmailSignUp = async ({ email, password, firstName, lastName }: SignUpFormSchema) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    await authClient.signUp.email(
      { email, password, name: `${firstName.trim()} ${lastName.trim()}`.trim() },
      {
        onSuccess: () => {
          success('Account created', { message: 'Signed up successfully.' });
        },
        onError: (err) => {
          console.error(err);
          const message =
            (err as { error?: { message?: string } })?.error?.message ||
            'Unable to sign up. Please try again.';
          setErrorMessage(message);
          error(message);
        },
      },
    );
    setIsSubmitting(false);
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
        <YStack flex={1} bg="$background" p="$6" gap="$6" justify="center">
          <YStack gap="$2" animation="fast" enterStyle={{ opacity: 0, y: 8 }}>
            <Text fontSize="$12" fontWeight="800" letterSpacing={-0.5}>
              Create account
            </Text>
            <Text color="$color">Sign up to get started.</Text>
          </YStack>

          <YStack
            p="$6"
            gap="$4"
            rounded="$6"
            bg="$background08"
            borderColor="$borderColor"
            borderWidth={1}
            elevation={2}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 6 }}
            shadowOpacity={0.06}
            shadowRadius={12}
            animation="fast"
            enterStyle={{ opacity: 0, y: 10 }}
          >
            {errorMessage ? (
              <YStack background="$red2" b="$4" p="$3" borderColor="$red10" borderWidth={1}>
                <Text color="$red10">{errorMessage}</Text>
              </YStack>
            ) : null}

            <Form onSubmit={form.handleSubmit(handleEmailSignUp)} gap="$4">
              <XStack gap="$2">
                <YStack gap="$2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Controller
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="John"
                        autoCapitalize="words"
                        autoComplete="name"
                        autoCorrect={false}
                      />
                    )}
                  />
                  {!!form.formState.errors.firstName?.message && (
                    <Text color="$red10" fontSize="$2">
                      {form.formState.errors.firstName.message}
                    </Text>
                  )}
                </YStack>
                <YStack gap="$2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Controller
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <Input
                        id="lastName"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="Doe"
                        autoCapitalize="words"
                        autoComplete="name"
                        autoCorrect={false}
                      />
                    )}
                  />
                  {!!form.formState.errors.lastName?.message && (
                    <Text color="$red10" fontSize="$2">
                      {form.formState.errors.lastName.message}
                    </Text>
                  )}
                </YStack>
              </XStack>
              <YStack gap="$2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <XStack
                      items="center"
                      borderWidth={1}
                      b="$4"
                      background="$background"
                      borderColor={isEmailFocused ? '$accentColor' : '$borderColor'}
                      px="$3"
                    >
                      <XStack pr="$2">
                        <Ionicons name="mail" size={18} color="gray" />
                      </XStack>
                      <Input
                        flex={1}
                        id="email"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                      />
                    </XStack>
                  )}
                />
                {!!form.formState.errors.email?.message && (
                  <Text color="$red10" fontSize="$2">
                    {form.formState.errors.email.message}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Label htmlFor="password">Password</Label>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <XStack
                      items="center"
                      borderWidth={1}
                      rounded="$4"
                      background="$background"
                      borderColor={isPasswordFocused ? '$accentColor' : '$borderColor'}
                      px="$3"
                    >
                      <XStack pr="$2">
                        <Ionicons name="lock-closed" size={18} color="gray" />
                      </XStack>
                      <Input
                        flex={1}
                        id="password"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password"
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                      />
                    </XStack>
                  )}
                />
                {!!form.formState.errors.password?.message && (
                  <Text color="$red10" fontSize="$2">
                    {form.formState.errors.password.message}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Controller
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <XStack
                      items="center"
                      borderWidth={1}
                      rounded="$4"
                      background="$background"
                      borderColor={isConfirmFocused ? '$accentColor' : '$borderColor'}
                      px="$3"
                    >
                      <XStack pr="$2">
                        <Ionicons name="lock-closed" size={18} color="gray" />
                      </XStack>
                      <Input
                        flex={1}
                        id="confirmPassword"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password"
                        onFocus={() => setIsConfirmFocused(true)}
                        onBlur={() => setIsConfirmFocused(false)}
                      />
                    </XStack>
                  )}
                />
                {!!form.formState.errors.confirmPassword?.message && (
                  <Text color="$red10" fontSize="$2">
                    {form.formState.errors.confirmPassword.message}
                  </Text>
                )}
              </YStack>

              <Button
                disabled={!canSubmit}
                aria-disabled={isSubmitting}
                aria-busy={isSubmitting}
                aria-label="Sign up"
                iconAfter={isSubmitting ? <Spinner size="small" /> : undefined}
                animation="bouncy"
                onPress={() => {
                  form.handleSubmit(handleEmailSignUp)();
                }}
              >
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Form>

            <XStack gap="$1" items="center" justify="center">
              <Text color="$color">Already have an account?</Text>
              <Link href="/(public)/sign-in" asChild>
                <Text color="$accentColor" fontWeight="700">
                  Sign In
                </Text>
              </Link>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
