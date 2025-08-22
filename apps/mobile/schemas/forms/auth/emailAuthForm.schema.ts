import { emailValidation, passwordValidation } from '@counsy-ai/types';
import { z } from 'zod';

export const emailAuthFormSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type EmailAuthFormSchema = z.infer<typeof emailAuthFormSchema>;

export const emailAuthFormDefaultValues: EmailAuthFormSchema = {
  email: '',
  password: '',
};
