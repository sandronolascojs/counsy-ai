import type { SnsEvent, SnsRecord } from '@counsy-ai/types';
import {
  ExpoPushPayloadSchema,
  MAIL_TEMPLATE_SCHEMAS,
  MailTemplateId,
  NotificationTransporterType,
  type ExpoPushPayload,
  type MailTemplateProps,
  type MailTemplateSchema,
  type NotificationsEmailQueuePayload,
} from '@counsy-ai/types';
import { normalizeTransporterType } from './snsUtils';

function isMailTemplateId(value: unknown): value is MailTemplateId {
  return typeof value === 'string' && (Object.values(MailTemplateId) as string[]).includes(value);
}

function validateProps<T extends MailTemplateId>(
  template: T,
  props: unknown,
): MailTemplateProps<T> {
  const schema = MAIL_TEMPLATE_SCHEMAS[template] as MailTemplateSchema<T>;
  const parsed = schema.safeParse(props ?? {});
  if (!parsed.success) {
    throw new Error(`Invalid props for template ${template}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function parseEmailQueueRecord(record: SnsRecord): NotificationsEmailQueuePayload {
  const raw = JSON.parse(record.Sns.Message) as unknown;
  if (!raw || typeof raw !== 'object') {
    throw new Error('SNS message is not an object');
  }

  const msg = raw as Partial<NotificationsEmailQueuePayload> & { props?: unknown };

  if (!isMailTemplateId(msg.template)) {
    throw new Error('Invalid or missing template in SNS message');
  }
  if (typeof msg.to !== 'string' || typeof msg.subject !== 'string') {
    throw new Error('Invalid or missing "to"/"subject" in SNS message');
  }

  // Narrow template to specific variant for strict typing
  switch (msg.template) {
    case MailTemplateId.WELCOME: {
      const props = validateProps(MailTemplateId.WELCOME, msg.props);
      return { template: MailTemplateId.WELCOME, to: msg.to, subject: msg.subject, props };
    }
    case MailTemplateId.RESET_PASSWORD: {
      const props = validateProps(MailTemplateId.RESET_PASSWORD, msg.props);
      return { template: MailTemplateId.RESET_PASSWORD, to: msg.to, subject: msg.subject, props };
    }
    case MailTemplateId.SUBSCRIPTION_TRIAL_START: {
      const props = validateProps(MailTemplateId.SUBSCRIPTION_TRIAL_START, msg.props);
      return {
        template: MailTemplateId.SUBSCRIPTION_TRIAL_START,
        to: msg.to,
        subject: msg.subject,
        props,
      };
    }
    case MailTemplateId.SUBSCRIPTION_TRIAL_END: {
      const props = validateProps(MailTemplateId.SUBSCRIPTION_TRIAL_END, msg.props);
      return {
        template: MailTemplateId.SUBSCRIPTION_TRIAL_END,
        to: msg.to,
        subject: msg.subject,
        props,
      };
    }
    case MailTemplateId.SUBSCRIPTION_ACTIVE: {
      const props = validateProps(MailTemplateId.SUBSCRIPTION_ACTIVE, msg.props);
      return {
        template: MailTemplateId.SUBSCRIPTION_ACTIVE,
        to: msg.to,
        subject: msg.subject,
        props,
      };
    }
    case MailTemplateId.SUBSCRIPTION_PAST_DUE: {
      const props = validateProps(MailTemplateId.SUBSCRIPTION_PAST_DUE, msg.props);
      return {
        template: MailTemplateId.SUBSCRIPTION_PAST_DUE,
        to: msg.to,
        subject: msg.subject,
        props,
      };
    }
    case MailTemplateId.MAGIC_LINK: {
      const props = validateProps(MailTemplateId.MAGIC_LINK, msg.props);
      return { template: MailTemplateId.MAGIC_LINK, to: msg.to, subject: msg.subject, props };
    }
    default: {
      // Exhaustiveness guard
      const neverValue: never = msg.template;
      throw new Error(`Unsupported template: ${String(neverValue)}`);
    }
  }
}

export function extractEmailQueueMessages(event: SnsEvent): NotificationsEmailQueuePayload[] {
  const results: NotificationsEmailQueuePayload[] = [];
  for (const rec of event.Records) {
    const raw = rec.Sns.MessageAttributes.queue?.Value;
    const transporter = raw ? normalizeTransporterType(raw) : undefined;
    if (transporter && transporter !== NotificationTransporterType.MAIL) continue;
    results.push(parseEmailQueueRecord(rec));
  }
  return results;
}

export function extractExpoQueueMessages(event: SnsEvent): ExpoPushPayload[] {
  const results: ExpoPushPayload[] = [];
  for (const rec of event.Records) {
    const raw = rec.Sns.MessageAttributes.queue?.Value;
    const transporter = raw ? normalizeTransporterType(raw) : undefined;
    if (transporter && transporter !== NotificationTransporterType.EXPO) continue;
    const parsed = ExpoPushPayloadSchema.safeParse(JSON.parse(rec.Sns.Message));
    if (!parsed.success) {
      throw new Error(`Invalid Expo payload: ${parsed.error.message}`);
    }
    results.push(parsed.data);
  }
  return results;
}
