import { Button } from '@/components/ui/Button';
import { env } from '@/config/env.config';
import { Link } from 'expo-router';
import React from 'react';
import { Form, Input, Label, Text, YStack } from 'tamagui';

interface Props {}

export const RecoverPasswordScreen = ({}: Props) => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleRecover = async () => {
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // Assumes API exposes a password reset request endpoint
      await fetch(`${env.EXPO_PUBLIC_API_URL}/api/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSuccessMessage('If an account exists for this email, a reset link has been sent.');
    } catch (error: unknown) {
      setErrorMessage('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <YStack flex={1} bg="$background" p="$6" gap="$6" justify="center">
      <YStack gap="$2">
        <Text fontSize="$10" fontWeight="800">
          Recover password
        </Text>
        <Text color="$color8">Enter your email and we will send you a reset link.</Text>
      </YStack>

      {errorMessage ? (
        <YStack bg="$red2" borderCurve="circular" p="$3">
          <Text color="$red10">{errorMessage}</Text>
        </YStack>
      ) : null}
      {successMessage ? (
        <YStack bg="$green2" borderCurve="circular" p="$3">
          <Text color="$green10">{successMessage}</Text>
        </YStack>
      ) : null}

      <Form onSubmit={handleRecover} gap="$4">
        <YStack gap="$2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />
        </YStack>
        <Button onPress={handleRecover} disabled={!email || isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send recovery link'}
        </Button>
      </Form>

      <Link href="/(public)/sign-in" asChild>
        <Text color="$accentColor" fontWeight="700">
          Back to Sign In
        </Text>
      </Link>
    </YStack>
  );
};

export default RecoverPasswordScreen;
