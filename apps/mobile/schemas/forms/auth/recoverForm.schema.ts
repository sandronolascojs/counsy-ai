import { AuthErrorTranslations } from '@/i18n/constants';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createRecoverFormSchema = (t: TFunction) =>
  z.object({
    email: z
      .string({
        message: t(AuthErrorTranslations.EMAIL_INVALID),
      })
      .min(1, {
        message: t(AuthErrorTranslations.EMAIL_REQUIRED),
      })
      .email({
        message: t(AuthErrorTranslations.EMAIL_INVALID),
      }),
  });

export type RecoverFormSchema = z.infer<ReturnType<typeof createRecoverFormSchema>>;

export const recoverFormDefaultValues: RecoverFormSchema = {
  email: '',
};
