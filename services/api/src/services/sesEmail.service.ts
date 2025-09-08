import { env } from '@/config/env.config';
import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import { APP_CONFIG } from '@counsy-ai/types';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string[];
}

export class SesEmailService {
  private readonly client: SESv2Client;
  private readonly fromAddress: string;
  private readonly configurationSetName?: string;

  constructor() {
    this.client = new SESv2Client({
      region: env.AWS_REGION,
    });

    // Use display name + email so recipients see the app name
    const displayName = APP_CONFIG.basics.name;
    this.fromAddress = `${displayName} <${env.FROM_EMAIL}>`;
    this.configurationSetName = env.SES_CONFIGURATION_SET;
  }

  public async sendEmail(params: SendEmailParams): Promise<void> {
    const input: SendEmailCommandInput = {
      FromEmailAddress: this.fromAddress,
      Destination: {
        ToAddresses: [params.to],
      },
      ReplyToAddresses: params.replyTo,
      Content: {
        Simple: {
          Subject: { Data: params.subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: params.html, Charset: 'UTF-8' },
            Text: params.text ? { Data: params.text, Charset: 'UTF-8' } : undefined,
          },
        },
      },
      ConfigurationSetName: this.configurationSetName,
    };

    await this.client.send(new SendEmailCommand(input));
  }
}

export const emailServiceSingleton = new SesEmailService();
