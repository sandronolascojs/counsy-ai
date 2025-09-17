import { SESv2Client, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import { APP_CONFIG } from '@counsy-ai/types';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string[];
  fromEmail: string;
  awsRegion: string;
  configurationSetName?: string;
}

export class EmailService {
  private readonly client: SESv2Client;
  private readonly fromAddress: string;
  private readonly configurationSetName?: string;

  constructor({
    fromEmail,
    region,
    configurationSetName,
  }: {
    fromEmail: string;
    region: string;
    configurationSetName?: string;
  }) {
    this.client = new SESv2Client({ region });
    const displayName = APP_CONFIG.basics.name;
    this.fromAddress = `${displayName} <${fromEmail}>`;
    this.configurationSetName = configurationSetName;
  }

  public async sendEmail(
    params: Omit<SendEmailParams, 'fromEmail' | 'awsRegion' | 'configurationSetName'>,
  ): Promise<void> {
    const input: SendEmailCommandInput = {
      FromEmailAddress: this.fromAddress,
      Destination: { ToAddresses: [params.to] },
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
