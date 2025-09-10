import { env } from '@/config/env.config';
import { logger } from '@/utils/logger.instance';
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

    try {
      await this.client.send(new SendEmailCommand(input));
    } catch (error) {
      logger.error('Failed to send email via SES', {
        to: params.to,
        subject: params.subject,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Rethrow with additional context while preserving original error
      const contextualError = new Error(
        `Failed to send email to ${params.to} with subject "${params.subject}": ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      // Preserve original stack trace
      if (error instanceof Error && error.stack) {
        contextualError.stack = error.stack;
      }

      throw contextualError;
    }
  }
}

export const emailServiceSingleton = new SesEmailService();
