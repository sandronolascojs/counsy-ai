import { env } from '@/config/env.config';
import type { SqsEvent } from '@/types';
import { EmailService, normalizeTransporterType } from '@counsy-ai/shared';
import { NotificationTransporterType } from '@counsy-ai/types';
import { getUserLocale, parseEmailPayload, renderEmail } from './notifications';

const ses = new EmailService({
  fromEmail: env.FROM_EMAIL,
  region: env.AWS_REGION,
  configurationSetName: env.SES_CONFIGURATION_SET,
});

// Minimal SQS processor for SNS -> SQS messages (and plain SQS JSON)
export const handler = async (event: SqsEvent): Promise<void> => {
  for (const record of event?.Records ?? []) {
    try {
      const { payload, attrs } = decodeSqsBody(record.body);

      const transporter = attrs.queue
        ? normalizeTransporterType(attrs.queue)
        : NotificationTransporterType.MAIL;

      if (transporter === NotificationTransporterType.MAIL) {
        const emailMsg = parseEmailPayload(payload);

        const locale = await getUserLocale(attrs.userId);
        const html = await renderEmail(emailMsg, locale);
        await ses.sendEmail({ to: emailMsg.to, subject: emailMsg.subject, html });
        continue;
      }

      // Future: support NotificationTransporterType.EXPO here
      // For now, ignore non-MAIL transporters gracefully
    } catch (err) {
      // Rethrow to enable SQS retry / DLQ
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
};

function decodeSqsBody(body: string): { payload: unknown; attrs: Record<string, string> } {
  const outer = tryParse(body);
  if (isObject(outer) && typeof outer.Message === 'string') {
    const inner = tryParse(outer.Message);
    const raw = (outer.MessageAttributes ?? {}) as Record<
      string,
      { Type?: string; Value?: string }
    >;
    const attrs: Record<string, string> = {};
    for (const k in raw) {
      const v = raw[k]?.Value;
      if (typeof v === 'string') attrs[k] = v;
    }
    return { payload: inner, attrs };
  }
  return { payload: outer, attrs: {} };
}

function tryParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}
