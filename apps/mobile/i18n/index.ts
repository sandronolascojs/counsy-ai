import { Locale, useLocales } from 'expo-localization';
import i18n, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { NAMESPACES } from './constants';

import enAccount from './locales/en/account.json';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enGreetings from './locales/en/greetings.json';
import enNavigation from './locales/en/navigation.json';
import enSettings from './locales/en/settings.json';
import enVoice from './locales/en/voice.json';

import esAccount from './locales/es/account.json';
import esAuth from './locales/es/auth.json';
import esCommon from './locales/es/common.json';
import esGreetings from './locales/es/greetings.json';
import esNavigation from './locales/es/navigation.json';
import esSettings from './locales/es/settings.json';
import esVoice from './locales/es/voice.json';

export const resources = {
  en: {
    [NAMESPACES.NAVIGATION]: enNavigation,
    [NAMESPACES.GREETINGS]: enGreetings,
    [NAMESPACES.VOICE]: enVoice,
    [NAMESPACES.SETTINGS]: enSettings,
    [NAMESPACES.ACCOUNT]: enAccount,
    [NAMESPACES.AUTH]: enAuth,
    [NAMESPACES.COMMON]: enCommon,
  },
  es: {
    [NAMESPACES.NAVIGATION]: esNavigation,
    [NAMESPACES.GREETINGS]: esGreetings,
    [NAMESPACES.VOICE]: esVoice,
    [NAMESPACES.SETTINGS]: esSettings,
    [NAMESPACES.ACCOUNT]: esAccount,
    [NAMESPACES.AUTH]: esAuth,
    [NAMESPACES.COMMON]: esCommon,
  },
} as const;

const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function getPreferredLanguage(locales: Locale[]): SupportedLanguage {
  for (const locale of locales) {
    const code = locale.languageCode?.toLowerCase();
    if (code && SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)) {
      return code as SupportedLanguage;
    }
  }
  return 'en';
}

export function useCurrentLanguage(): SupportedLanguage {
  const locales = useLocales();
  return getPreferredLanguage(locales);
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: Object.values(NAMESPACES),
  defaultNS: NAMESPACES.NAVIGATION,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

function initializeI18n(language: SupportedLanguage) {
  if (i18n.language !== language) {
    changeLanguage(language);
  }
}

export { i18n, initializeI18n };
