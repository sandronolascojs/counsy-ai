import { AuthErrorTranslations } from '@/i18n/constants';
import { EMAIL_REGEX } from '@counsy-ai/types';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createSignInFormSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t(AuthErrorTranslations.EMAIL_REQUIRED),
      })
      .regex(EMAIL_REGEX, {
        message: t(AuthErrorTranslations.EMAIL_INVALID),
      }),
    password: z.string().min(1, { message: t(AuthErrorTranslations.PASSWORD_REQUIRED) }),
  });

export type SignInFormSchema = z.infer<ReturnType<typeof createSignInFormSchema>>;

export const signInFormDefaultValues: SignInFormSchema = {
  email: '',
  password: '',
};
