import { emailValidation, passwordValidation } from '@counsy-ai/types';
import { z } from 'zod';

export const signInFormSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

export const signInFormDefaultValues: SignInFormSchema = {
  email: '',
  password: '',
};
