import { emailRender } from '@/tools/emailRender';
import { Locale, MAIL_TEMPLATE_SCHEMAS, MailTemplateId } from '@counsy-ai/types';
import { z } from 'zod';

// Build runtime schemas for payload validation (props without locale)
const MAIL_PROPS_NO_LOCALE = {
  [MailTemplateId.WELCOME]: MAIL_TEMPLATE_SCHEMAS.WELCOME.omit({ locale: true }),
  [MailTemplateId.RESET_PASSWORD]: MAIL_TEMPLATE_SCHEMAS.RESET_PASSWORD.omit({ locale: true }),
  [MailTemplateId.MAGIC_LINK]: MAIL_TEMPLATE_SCHEMAS.MAGIC_LINK.omit({ locale: true }),
  [MailTemplateId.SUBSCRIPTION_TRIAL_START]: MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_TRIAL_START.omit({
    locale: true,
  }),
  [MailTemplateId.SUBSCRIPTION_TRIAL_END]: MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_TRIAL_END.omit({
    locale: true,
  }),
  [MailTemplateId.SUBSCRIPTION_ACTIVE]: MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_ACTIVE.omit({
    locale: true,
  }),
  [MailTemplateId.SUBSCRIPTION_PAST_DUE]: MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_PAST_DUE.omit({
    locale: true,
  }),
} as const;

const BaseEmailFields = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
});

export const EmailQueuePayloadSchema = z.union([
  z.object({
    template: z.literal(MailTemplateId.WELCOME),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.WELCOME].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.RESET_PASSWORD),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.RESET_PASSWORD].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.MAGIC_LINK),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.MAGIC_LINK].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.SUBSCRIPTION_TRIAL_START),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.SUBSCRIPTION_TRIAL_START].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.SUBSCRIPTION_TRIAL_END),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.SUBSCRIPTION_TRIAL_END].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.SUBSCRIPTION_ACTIVE),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.SUBSCRIPTION_ACTIVE].optional(),
  }),
  z.object({
    template: z.literal(MailTemplateId.SUBSCRIPTION_PAST_DUE),
    ...BaseEmailFields.shape,
    props: MAIL_PROPS_NO_LOCALE[MailTemplateId.SUBSCRIPTION_PAST_DUE].optional(),
  }),
] as const);

export type EmailQueuePayload = z.infer<typeof EmailQueuePayloadSchema>;

export function parseEmailPayload(input: unknown): EmailQueuePayload {
  const parsed = EmailQueuePayloadSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid email payload: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function getUserLocale(userId: string | undefined): Promise<Locale> {
  // TODO: Add locale field to users table and implement proper locale fetching
  // For now, return default locale
  return Locale.EN_US;
}

export async function renderEmail(message: EmailQueuePayload, locale: Locale): Promise<string> {
  switch (message.template) {
    case MailTemplateId.WELCOME: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.WELCOME.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.WELCOME, propsWithLocale);
    }
    case MailTemplateId.RESET_PASSWORD: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.RESET_PASSWORD.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.RESET_PASSWORD, propsWithLocale);
    }
    case MailTemplateId.MAGIC_LINK: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.MAGIC_LINK.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.MAGIC_LINK, propsWithLocale);
    }
    case MailTemplateId.SUBSCRIPTION_TRIAL_START: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_TRIAL_START.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.SUBSCRIPTION_TRIAL_START, propsWithLocale);
    }
    case MailTemplateId.SUBSCRIPTION_TRIAL_END: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_TRIAL_END.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.SUBSCRIPTION_TRIAL_END, propsWithLocale);
    }
    case MailTemplateId.SUBSCRIPTION_ACTIVE: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_ACTIVE.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.SUBSCRIPTION_ACTIVE, propsWithLocale);
    }
    case MailTemplateId.SUBSCRIPTION_PAST_DUE: {
      const propsWithLocale = MAIL_TEMPLATE_SCHEMAS.SUBSCRIPTION_PAST_DUE.parse({
        ...(message.props ?? {}),
        locale,
      });
      return await emailRender(MailTemplateId.SUBSCRIPTION_PAST_DUE, propsWithLocale);
    }
    default: {
      throw new Error('Unsupported template', { cause: message });
    }
  }
}
