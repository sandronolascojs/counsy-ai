import { Locale, useLocales } from 'expo-localization';
import i18n, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';

export const resources = {
  en: { common: enCommon },
  es: { common: esCommon },
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

// i18n initialization (runs once)
function initializeI18n(language: SupportedLanguage) {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v4',
      resources,
      lng: language,
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  } else {
    changeLanguage(language);
  }
}

export { i18n, initializeI18n };
