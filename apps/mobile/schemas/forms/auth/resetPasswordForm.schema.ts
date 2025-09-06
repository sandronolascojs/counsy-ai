import { AuthErrorTranslations } from '@/i18n/constants';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createResetPasswordFormSchema = (t: TFunction) =>
  z
    .object({
      password: z
        .string()
        .min(8, { message: t(AuthErrorTranslations.PASSWORD_TOO_SHORT, { min: 8 }) })
        .max(128, { message: t(AuthErrorTranslations.PASSWORD_TOO_LONG, { max: 128 }) }),
      confirmPassword: z.string().min(1, {
        message: t(AuthErrorTranslations.CONFIRM_PASSWORD_REQUIRED),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(AuthErrorTranslations.PASSWORDS_DO_NOT_MATCH),
      path: ['confirmPassword'],
    });

export type ResetPasswordFormSchema = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;

export const resetPasswordFormDefaultValues: ResetPasswordFormSchema = {
  password: '',
  confirmPassword: '',
};
