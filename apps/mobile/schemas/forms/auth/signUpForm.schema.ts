import { i18n } from '@/i18n';
import { AuthErrorTranslations } from '@/i18n/constants';
import {
  EMAIL_REGEX,
  MAX_NAME_LENGTH,
  NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '@counsy-ai/types';
import { z } from 'zod';

export const signUpFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: i18n.t(AuthErrorTranslations.FIRST_NAME_REQUIRED) })
      .max(MAX_NAME_LENGTH, {
        message: i18n.t(AuthErrorTranslations.FIRST_NAME_TOO_LONG),
      })
      .regex(NAME_REGEX, {
        message: i18n.t(AuthErrorTranslations.FIRST_NAME_INVALID),
      }),
    lastName: z
      .string()
      .min(1, { message: i18n.t(AuthErrorTranslations.LAST_NAME_REQUIRED) })
      .max(MAX_NAME_LENGTH, {
        message: i18n.t(AuthErrorTranslations.LAST_NAME_TOO_LONG),
      })
      .regex(NAME_REGEX, {
        message: i18n.t(AuthErrorTranslations.LAST_NAME_INVALID),
      }),
    email: z
      .string()
      .min(1, {
        message: i18n.t(AuthErrorTranslations.EMAIL_REQUIRED),
      })
      .regex(EMAIL_REGEX, {
        message: i18n.t(AuthErrorTranslations.EMAIL_INVALID),
      }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: i18n.t(AuthErrorTranslations.PASSWORD_TOO_SHORT, {
          min: PASSWORD_MIN_LENGTH,
        }),
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: i18n.t(AuthErrorTranslations.PASSWORD_TOO_LONG, {
          max: PASSWORD_MAX_LENGTH,
        }),
      })
      .regex(PASSWORD_REGEX, {
        message: i18n.t(AuthErrorTranslations.PASSWORD_COMPLEXITY),
      }),

    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: i18n.t(AuthErrorTranslations.CONFIRM_PASSWORD_TOO_SHORT, {
          min: PASSWORD_MIN_LENGTH,
        }),
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: i18n.t(AuthErrorTranslations.CONFIRM_PASSWORD_TOO_LONG, {
          max: PASSWORD_MAX_LENGTH,
        }),
      })
      .regex(PASSWORD_REGEX, {
        message: i18n.t(AuthErrorTranslations.CONFIRM_PASSWORD_COMPLEXITY),
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: i18n.t(AuthErrorTranslations.PASSWORDS_DO_NOT_MATCH),
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const signUpFormDefaultValues: SignUpFormSchema = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
