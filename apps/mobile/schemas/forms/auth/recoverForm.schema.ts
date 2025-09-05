import { i18n } from '@/i18n';
import { AuthErrorTranslations } from '@/i18n/constants';
import { EMAIL_REGEX } from '@counsy-ai/types';
import { z } from 'zod';

export const recoverFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: i18n.t(AuthErrorTranslations.EMAIL_REQUIRED),
    })
    .regex(EMAIL_REGEX, {
      message: i18n.t(AuthErrorTranslations.EMAIL_INVALID),
    }),
});

export type RecoverFormSchema = z.infer<typeof recoverFormSchema>;

export const recoverFormDefaultValues: RecoverFormSchema = {
  email: '',
};
