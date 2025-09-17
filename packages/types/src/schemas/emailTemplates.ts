import { z } from 'zod';
import type { MailTemplateId } from '../enums';
import { BillingCycle, Currency, Locale } from '../enums';

const BASE_EMAIL_PROPS_SCHEMA = z.object({
  locale: z.nativeEnum(Locale),
});

export const MAIL_TEMPLATE_SCHEMAS = {
  WELCOME: BASE_EMAIL_PROPS_SCHEMA.extend({
    firstName: z.string(),
  }),
  RESET_PASSWORD: BASE_EMAIL_PROPS_SCHEMA.extend({
    resetPasswordUrl: z.string().url(),
    firstName: z.string(),
  }),
  MAGIC_LINK: BASE_EMAIL_PROPS_SCHEMA.extend({
    magicLinkUrl: z.string().url(),
    firstName: z.string(),
  }),
  SUBSCRIPTION_TRIAL_START: BASE_EMAIL_PROPS_SCHEMA.extend({
    firstName: z.string(),
    startDateISO: z.string(),
    trialDays: z.number().int().positive(),
    planName: z.string(),
    billingPeriod: z.nativeEnum(BillingCycle),
    amount: z.number().nonnegative(),
    currency: z.nativeEnum(Currency),
  }),
  SUBSCRIPTION_TRIAL_END: BASE_EMAIL_PROPS_SCHEMA.extend({
    endedAtISO: z.string(),
  }),
  SUBSCRIPTION_ACTIVE: BASE_EMAIL_PROPS_SCHEMA.extend({
    planName: z.string(),
    startedAtISO: z.string(),
    nextChargeISO: z.string(),
    amount: z.number().nonnegative(),
    currency: z.nativeEnum(Currency),
    billingPeriod: z.nativeEnum(BillingCycle).optional(),
  }),
  SUBSCRIPTION_PAST_DUE: BASE_EMAIL_PROPS_SCHEMA.extend({
    planName: z.string(),
    billingPeriod: z.nativeEnum(BillingCycle),
    amountDue: z.number().nonnegative(),
    currency: z.nativeEnum(Currency),
    payUrl: z.string().url().optional(),
  }),
} as const;
export type MailTemplateSchema<T extends MailTemplateId> = (typeof MAIL_TEMPLATE_SCHEMAS)[T];
export type MailTemplateProps<T extends MailTemplateId> = z.infer<MailTemplateSchema<T>>;
