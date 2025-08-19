import { emailValidation, nameValidation, passwordValidation } from '@counsy-ai/types';
import { z } from 'zod';

export const signUpFormSchema = z
  .object({
    firstName: nameValidation('First name'),
    lastName: nameValidation('Last name'),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const signUpFormDefaultValues: SignUpFormSchema = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
