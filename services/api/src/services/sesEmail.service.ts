import { env } from '@/config/env.config';
import { logger } from '@/utils/logger.instance';
import { SesEmailService } from '@counsy-ai/shared';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string[];
}

export class ApiSesEmailService {
  private readonly impl = new SesEmailService({
    fromEmail: env.FROM_EMAIL,
    region: env.AWS_REGION,
    configurationSetName: env.SES_CONFIGURATION_SET,
  });

  public async sendEmail(params: SendEmailParams): Promise<void> {
    try {
      await this.impl.sendEmail(params);
    } catch (error) {
      logger.error('Failed to send email via SES', {
        to: params.to,
        subject: params.subject,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}

export const emailServiceSingleton = new ApiSesEmailService();
