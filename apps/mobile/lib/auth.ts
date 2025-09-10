import { env } from '@/config/env.config';
import { i18n } from '@/i18n';
import { AuthErrorTranslations, CommonTranslations, NAMESPACES } from '@/i18n/constants';
import { expoClient } from '@better-auth/expo/client';
import { APP_CONFIG } from '@counsy-ai/types';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      storagePrefix: APP_CONFIG.basics.prefix,
      storage: SecureStore,
    }),
  ],
});

export enum BetterAuthErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  FAILED_TO_CREATE_USER = 'FAILED_TO_CREATE_USER',
  FAILED_TO_CREATE_SESSION = 'FAILED_TO_CREATE_SESSION',
  FAILED_TO_UPDATE_USER = 'FAILED_TO_UPDATE_USER',
  FAILED_TO_GET_SESSION = 'FAILED_TO_GET_SESSION',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_EMAIL_OR_PASSWORD = 'INVALID_EMAIL_OR_PASSWORD',
  SOCIAL_ACCOUNT_ALREADY_LINKED = 'SOCIAL_ACCOUNT_ALREADY_LINKED',
  PROVIDER_NOT_FOUND = 'PROVIDER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ID_TOKEN_NOT_SUPPORTED = 'ID_TOKEN_NOT_SUPPORTED',
  FAILED_TO_GET_USER_INFO = 'FAILED_TO_GET_USER_INFO',
  USER_EMAIL_NOT_FOUND = 'USER_EMAIL_NOT_FOUND',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  PASSWORD_TOO_LONG = 'PASSWORD_TOO_LONG',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  EMAIL_CAN_NOT_BE_UPDATED = 'EMAIL_CAN_NOT_BE_UPDATED',
  CREDENTIAL_ACCOUNT_NOT_FOUND = 'CREDENTIAL_ACCOUNT_NOT_FOUND',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  FAILED_TO_UNLINK_LAST_ACCOUNT = 'FAILED_TO_UNLINK_LAST_ACCOUNT',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  USER_ALREADY_HAS_PASSWORD = 'USER_ALREADY_HAS_PASSWORD',
  PASSWORD_COMPROMISED = 'PASSWORD_COMPROMISED',
  // Two-factor
  OTP_NOT_ENABLED = 'OTP_NOT_ENABLED',
  OTP_HAS_EXPIRED = 'OTP_HAS_EXPIRED',
  TOTP_NOT_ENABLED = 'TOTP_NOT_ENABLED',
  TWO_FACTOR_NOT_ENABLED = 'TWO_FACTOR_NOT_ENABLED',
  BACKUP_CODES_NOT_ENABLED = 'BACKUP_CODES_NOT_ENABLED',
  INVALID_BACKUP_CODE = 'INVALID_BACKUP_CODE',
  INVALID_CODE = 'INVALID_CODE',
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE = 'TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE',
  INVALID_TWO_FACTOR_COOKIE = 'INVALID_TWO_FACTOR_COOKIE',
  // Email OTP
  OTP_EXPIRED = 'OTP_EXPIRED',
  INVALID_OTP = 'INVALID_OTP',
}

const tNs = (ns: string, key: string): string => i18n.t(key, { ns });

export const getAuthErrorMessage = (code: string): string => {
  if (!code) return tNs(NAMESPACES.COMMON, CommonTranslations.ERROR_GENERIC);

  switch (code as BetterAuthErrorCode) {
    case BetterAuthErrorCode.USER_NOT_FOUND:
    case BetterAuthErrorCode.CREDENTIAL_ACCOUNT_NOT_FOUND:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.INVALID_CREDENTIALS);
    case BetterAuthErrorCode.INVALID_EMAIL:
    case BetterAuthErrorCode.INVALID_PASSWORD:
    case BetterAuthErrorCode.INVALID_EMAIL_OR_PASSWORD:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.INVALID_CREDENTIALS);
    case BetterAuthErrorCode.EMAIL_NOT_VERIFIED:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.EMAIL_NOT_VERIFIED);
    case BetterAuthErrorCode.USER_ALREADY_EXISTS:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.USER_ALREADY_EXISTS);
    case BetterAuthErrorCode.PASSWORD_TOO_SHORT:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.PASSWORD_TOO_SHORT);
    case BetterAuthErrorCode.PASSWORD_TOO_LONG:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.PASSWORD_TOO_LONG);
    case BetterAuthErrorCode.SESSION_EXPIRED:
      return tNs(NAMESPACES.COMMON, CommonTranslations.ERROR_UNAUTHORIZED);
    case BetterAuthErrorCode.PROVIDER_NOT_FOUND:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.PROVIDER_NOT_FOUND);
    case BetterAuthErrorCode.INVALID_TOKEN:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.INVALID_TOKEN);
    case BetterAuthErrorCode.FAILED_TO_CREATE_USER:
    case BetterAuthErrorCode.FAILED_TO_CREATE_SESSION:
    case BetterAuthErrorCode.FAILED_TO_UPDATE_USER:
    case BetterAuthErrorCode.FAILED_TO_GET_SESSION:
      return tNs(NAMESPACES.COMMON, CommonTranslations.ERROR_UNKNOWN);
    case BetterAuthErrorCode.OTP_NOT_ENABLED:
    case BetterAuthErrorCode.TOTP_NOT_ENABLED:
    case BetterAuthErrorCode.TWO_FACTOR_NOT_ENABLED:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.TWO_FACTOR_NOT_ENABLED);
    case BetterAuthErrorCode.OTP_EXPIRED:
    case BetterAuthErrorCode.OTP_HAS_EXPIRED:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.OTP_EXPIRED);
    case BetterAuthErrorCode.INVALID_OTP:
    case BetterAuthErrorCode.INVALID_CODE:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.INVALID_CODE);
    case BetterAuthErrorCode.TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
      return tNs(NAMESPACES.COMMON, CommonTranslations.ERROR_RATE_LIMITED);
    case BetterAuthErrorCode.PASSWORD_COMPROMISED:
      return tNs(NAMESPACES.AUTH, AuthErrorTranslations.PASSWORD_COMPROMISED);
    default:
      return tNs(NAMESPACES.COMMON, CommonTranslations.ERROR_GENERIC);
  }
};
