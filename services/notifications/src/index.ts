import { env } from '@/config/env.config';
import { emailRender } from '@/tools/emailRender';
import { SesEmailService } from '@counsy-ai/shared';
import { z } from 'zod';
import type { SendEmailRequest, SnsEvent } from './types';

const sendSchema = z.object({
  template: z.literal('MyEmail'),
  to: z.string().email(),
  subject: z.string().min(1),
  props: z.record(z.unknown()).optional(),
});

const ses = new SesEmailService({
  fromEmail: env.FROM_EMAIL,
  region: env.AWS_REGION,
  configurationSetName: env.SES_CONFIGURATION_SET,
});

export const handler = async (event: SnsEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.Sns.Message) as SendEmailRequest & { type?: string };

      // Simple router by type (email | expo). Default to email.
      const kind = (message as any).type ?? 'email';
      if (kind === 'email') {
        const parsed = sendSchema.safeParse(message);
        if (!parsed.success) {
          console.warn('Invalid email message', parsed.error.flatten());
          continue;
        }
        const html = await emailRender(parsed.data.template, parsed.data.props ?? {});
        await ses.sendEmail({ to: parsed.data.to, subject: parsed.data.subject, html });
        continue;
      }

      if (kind === 'expo') {
        // TODO: implement Expo push delivery using your existing expo notifications util
        // await sendExpoPush(message);
        continue;
      }
    } catch (err) {
      console.error('Failed to process SNS record', { err, recordId: record.Sns.MessageId });
    }
  }
};
