import { z } from 'zod';
import type { MailTemplateId } from '../enums';

// Zod schemas per template id for runtime validation
export const MAIL_TEMPLATE_SCHEMAS = {
  WELCOME: z.object({ firstName: z.string() }),
  SUBSCRIPTION_TRIAL_START: z.object({ trialDays: z.number().int().positive() }),
  SUBSCRIPTION_TRIAL_3D_LEFT: z.object({ remainingDays: z.number().int().positive() }),
  SUBSCRIPTION_TRIAL_END: z.object({ endedAtISO: z.string() }),
  SUBSCRIPTION_ACTIVE: z.object({ planName: z.string() }),
  SUBSCRIPTION_PAST_DUE: z.object({ invoiceUrl: z.string().url().optional() }),
} as const;
export type MailTemplateSchema<T extends MailTemplateId> = (typeof MAIL_TEMPLATE_SCHEMAS)[T];
export type MailTemplateProps<T extends MailTemplateId> = z.infer<MailTemplateSchema<T>>;
