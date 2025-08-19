import { Button } from '@/components/ui/Button';
import { env } from '@/config/env.config';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Form, Input, Label, Text, YStack } from 'tamagui';

interface Props {}

export const ResetPasswordScreen = ({}: Props) => {
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const tokenFromUrl = typeof params.token === 'string' ? params.token : '';
  const [token, setToken] = React.useState(tokenFromUrl);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleReset = async () => {
    if (!token || !password || password !== confirmPassword) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await fetch(`${env.EXPO_PUBLIC_API_URL}/api/auth/password/reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      setSuccessMessage('Your password has been updated. You can now sign in.');
    } catch (error: unknown) {
      setErrorMessage('Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMismatch =
    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit = Boolean(token) && Boolean(password) && !passwordsMismatch && !isSubmitting;

  return (
    <YStack flex={1} bg="$background" p="$6" gap="$6" justify="center">
      <YStack gap="$2">
        <Text fontSize="$10" fontWeight="800">
          Reset password
        </Text>
        <Text color="$color8">Enter your new password below.</Text>
      </YStack>

      {errorMessage ? (
        <YStack bg="$red2" rounded="$4" p="$3">
          <Text color="$red10">{errorMessage}</Text>
        </YStack>
      ) : null}
      {successMessage ? (
        <YStack bg="$green2" rounded="$4" p="$3">
          <Text color="$green10">{successMessage}</Text>
        </YStack>
      ) : null}

      <Form onSubmit={handleReset} gap="$4">
        <YStack gap="$2">
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            value={token}
            onChangeText={setToken}
            placeholder="Paste your reset token"
          />
        </YStack>
        <YStack gap="$2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
        </YStack>
        <YStack gap="$2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
        </YStack>

        {passwordsMismatch ? <Text color="$red10">Passwords do not match.</Text> : null}

        <Button onPress={handleReset} disabled={!canSubmit} aria-busy={isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </Form>
    </YStack>
  );
};

export default ResetPasswordScreen;
