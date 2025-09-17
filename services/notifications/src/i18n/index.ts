import { Locale } from '@counsy-ai/types';
import { EMAIL_NAMESPACES } from './constants';
import en_common from './templates/common/en.json';
import es_common from './templates/common/es.json';
import en_subscription_active from './templates/subscription_active/en.json';
import es_subscription_active from './templates/subscription_active/es.json';
import en_subscription_past_due from './templates/subscription_past_due/en.json';
import es_subscription_past_due from './templates/subscription_past_due/es.json';
import en_trial_start from './templates/trial_start/en.json';
import es_trial_start from './templates/trial_start/es.json';
import en_welcome from './templates/welcome/en.json';
import es_welcome from './templates/welcome/es.json';

type Dict = Record<string, string>;

const RESOURCES: Record<'en' | 'es', Record<string, Record<string, string>>> = {
  en: {
    common: en_common,
    welcome: en_welcome,
    trial_start: en_trial_start,
    subscription_active: en_subscription_active,
    subscription_past_due: en_subscription_past_due,
  },
  es: {
    common: es_common,
    welcome: es_welcome,
    trial_start: es_trial_start,
    subscription_active: es_subscription_active,
    subscription_past_due: es_subscription_past_due,
  },
};

const LOCALE_MAP: Partial<Record<Locale, 'en' | 'es'>> = {
  [Locale.EN_US]: 'en',
  [Locale.ES_ES]: 'es',
};

export function resolveLanguage(locale?: Locale): 'en' | 'es' {
  return (locale && LOCALE_MAP[locale]) || 'en';
}

type EmailNamespace = (typeof EMAIL_NAMESPACES)[keyof typeof EMAIL_NAMESPACES];

export function te(
  locale: Locale | undefined,
  key: string,
  params?: Record<string, string | number>,
  namespace: EmailNamespace = EMAIL_NAMESPACES.COMMON,
): string {
  const lang = resolveLanguage(locale);
  const dict = RESOURCES[lang][namespace] ?? {};
  const template = (dict as Dict)[key] ?? key;
  if (!params) return template;
  return Object.keys(params).reduce(
    (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k] || '')),
    template,
  );
}

export { EMAIL_NAMESPACES };
