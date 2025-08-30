import { emailValidation } from '@counsy-ai/types';
import { z } from 'zod';

export const recoverFormSchema = z.object({
  email: emailValidation,
});

export type RecoverFormSchema = z.infer<typeof recoverFormSchema>;

export const recoverFormDefaultValues: RecoverFormSchema = {
  email: '',
};
