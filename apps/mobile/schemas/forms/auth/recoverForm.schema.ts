import { AuthErrorTranslations } from '@/i18n/constants';
import { EMAIL_REGEX } from '@counsy-ai/types';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createRecoverFormSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t(AuthErrorTranslations.EMAIL_REQUIRED),
      })
      .regex(EMAIL_REGEX, {
        message: t(AuthErrorTranslations.EMAIL_INVALID),
      }),
  });

export type RecoverFormSchema = z.infer<ReturnType<typeof createRecoverFormSchema>>;

export const recoverFormDefaultValues: RecoverFormSchema = {
  email: '',
};
