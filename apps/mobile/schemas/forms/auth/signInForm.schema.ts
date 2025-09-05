import { i18n } from '@/i18n';
import { AuthErrorTranslations } from '@/i18n/constants';
import { EMAIL_REGEX } from '@counsy-ai/types';
import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: i18n.t(AuthErrorTranslations.EMAIL_REQUIRED),
    })
    .regex(EMAIL_REGEX, {
      message: i18n.t(AuthErrorTranslations.EMAIL_INVALID),
    }),
  password: z.string().min(1, { message: i18n.t(AuthErrorTranslations.PASSWORD_REQUIRED) }),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

export const signInFormDefaultValues: SignInFormSchema = {
  email: '',
  password: '',
};
