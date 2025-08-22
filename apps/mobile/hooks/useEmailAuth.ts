import { useToast } from '@/components/ui/Toast';
import { authClient } from '@/lib/auth';
import type { SignInFormSchema } from '@/schemas/forms/auth/signInForm.schema';
import { useCallback } from 'react';

interface UseEmailAuthOptions {
  onSuccess?: () => void;
}

export const useEmailAuth = ({ onSuccess }: UseEmailAuthOptions = {}) => {
  const { success, error: showError } = useToast();

  const signIn = useCallback(
    async ({ email, password }: SignInFormSchema) => {
      try {
        await authClient.signIn.email(
          { email, password },
          {
            onSuccess: () => {
              success('Welcome back', { message: 'Signed in successfully.' });
              onSuccess?.();
            },
            onError: (err) => {
              console.error(err);
              const message =
                (err as { error?: { message?: string } })?.error?.message ||
                'Unable to sign in. Please try again.';
              throw new Error(message);
            },
          },
        );
      } catch (err) {
        if (err instanceof Error) {
          showError(err.message);
          return { error: err.message };
        }
        showError('An unexpected error occurred');
        return { error: 'An unexpected error occurred' };
      }
    },
    [success, showError, onSuccess],
  );

  return { signIn };
};
