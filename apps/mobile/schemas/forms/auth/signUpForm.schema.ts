import { AuthErrorTranslations } from '@/i18n/constants';
import {
  EMAIL_REGEX,
  MAX_NAME_LENGTH,
  NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '@counsy-ai/types';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createSignUpFormSchema = (t: TFunction) =>
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, { message: t(AuthErrorTranslations.FIRST_NAME_REQUIRED) })
        .max(MAX_NAME_LENGTH, {
          message: t(AuthErrorTranslations.FIRST_NAME_TOO_LONG),
        })
        .regex(NAME_REGEX, {
          message: t(AuthErrorTranslations.FIRST_NAME_INVALID),
        }),
      lastName: z
        .string()
        .trim()
        .min(1, { message: t(AuthErrorTranslations.LAST_NAME_REQUIRED) })
        .max(MAX_NAME_LENGTH, {
          message: t(AuthErrorTranslations.LAST_NAME_TOO_LONG),
        })
        .regex(NAME_REGEX, {
          message: t(AuthErrorTranslations.LAST_NAME_INVALID),
        }),
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
      password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, {
          message: t(AuthErrorTranslations.PASSWORD_TOO_SHORT, {
            min: PASSWORD_MIN_LENGTH,
          }),
        })
        .max(PASSWORD_MAX_LENGTH, {
          message: t(AuthErrorTranslations.PASSWORD_TOO_LONG, {
            max: PASSWORD_MAX_LENGTH,
          }),
        })
        .regex(PASSWORD_REGEX, {
          message: t(AuthErrorTranslations.PASSWORD_COMPLEXITY),
        }),
      confirmPassword: z
        .string()
        .min(PASSWORD_MIN_LENGTH, {
          message: t(AuthErrorTranslations.CONFIRM_PASSWORD_TOO_SHORT, {
            min: PASSWORD_MIN_LENGTH,
          }),
        })
        .max(PASSWORD_MAX_LENGTH, {
          message: t(AuthErrorTranslations.CONFIRM_PASSWORD_TOO_LONG, {
            max: PASSWORD_MAX_LENGTH,
          }),
        })
        .regex(PASSWORD_REGEX, {
          message: t(AuthErrorTranslations.CONFIRM_PASSWORD_COMPLEXITY),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t(AuthErrorTranslations.PASSWORDS_DO_NOT_MATCH),
    });

export type SignUpFormSchema = z.infer<ReturnType<typeof createSignUpFormSchema>>;

export const signUpFormDefaultValues: SignUpFormSchema = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
