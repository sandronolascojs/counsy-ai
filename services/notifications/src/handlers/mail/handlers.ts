import { NotificationsUserRepository } from '@/repositories/user.repository';
import { NotificationsUserService } from '@/services/notificationsUser.service';
import { db } from '@counsy-ai/db';
import { EmailService, Logger } from '@counsy-ai/shared';
import {
  BillingCycle,
  Currency,
  Locale,
  MailTemplateId,
  MailTemplateProps,
  NotificationEventType,
  NotificationTransporterType,
} from '@counsy-ai/types';
import { env } from '../../config/env.config';
import { emailRender } from '../../tools/emailRender';
import {
  NotificationHandler,
  NotificationHandlerContext,
  NotificationHandlerResult,
} from '../types';

// Base class for mail handlers with common functionality
abstract class BaseMailHandler implements NotificationHandler {
  protected readonly notificationsUserService: NotificationsUserService;
  protected readonly emailService: EmailService;

  constructor(protected readonly logger: Logger) {
    this.emailService = new EmailService({
      fromEmail: env.FROM_EMAIL,
      region: env.AWS_REGION,
      configurationSetName: env.APP_ENV === 'development' ? undefined : env.SES_CONFIGURATION_SET,
    });
    this.notificationsUserService = new NotificationsUserService(
      new NotificationsUserRepository(db, logger),
      logger,
      db,
    );
  }

  abstract handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult>;

  protected async getUserData({ userId }: { userId: string }) {
    const user = await this.notificationsUserService.getUserById({
      id: userId,
    });
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    return user;
  }

  protected async sendEmail<T extends MailTemplateId>(
    templateId: T,
    to: string,
    subject: string,
    props: MailTemplateProps<T>,
  ) {
    const html = await emailRender(templateId, props);

    await this.emailService.sendEmail({
      to,
      subject,
      html,
    });
  }
}

export class WelcomeMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing welcome email notification', {
        userId: context.userId,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      // 1. Fetch user data from database
      const user = await this.getUserData({ userId: context.userId });

      // 2. Prepare email props
      const emailProps: MailTemplateProps<MailTemplateId.WELCOME> = {
        firstName: user.name,
        locale: Locale.EN_US,
      };

      // 3. Send welcome email
      await this.sendEmail(MailTemplateId.WELCOME, user.email, 'Welcome to Counsy AI!', emailProps);

      this.logger.info('Welcome email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `welcome-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.WELCOME,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process welcome email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class TrialStartMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing trial start email notification', {
        userId: context.userId,
        trialDays: context.additionalData?.trialDays,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      const locale = await this.notificationsUserService.getUserLocale({
        userId: context.userId,
      });

      // 1. Fetch user data from database
      const user = await this.notificationsUserService.getUserById({
        id: context.userId,
      });

      if (!user) {
        throw new Error(`User not found: ${context.userId}`);
      }

      if (!locale) {
        throw new Error(`Locale not found: ${context.userId}`);
      }

      // 2. Prepare email props
      const trialDays = (context.additionalData?.trialDays as number) || 7;
      const emailProps: MailTemplateProps<MailTemplateId.SUBSCRIPTION_TRIAL_START> = {
        firstName: user.name,
        trialDays,
        amount: 0, // Free trial
        currency: Currency.USD, // TODO: Get from user preferences
        startDateISO: new Date().toISOString(),
        planName: 'Premium Trial',
        billingPeriod: BillingCycle.MONTHLY, // TODO: Get from subscription
        locale,
      };

      // 3. Send trial start email
      await this.sendEmail(
        MailTemplateId.SUBSCRIPTION_TRIAL_START,
        user.email,
        'Your trial has started!',
        emailProps,
      );

      this.logger.info('Trial start email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        trialDays,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `trial-start-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.TRIAL_START,
          trialDays,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process trial start email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class Trial3DaysLeftMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing trial 3 days left email notification', {
        userId: context.userId,
        remainingDays: context.additionalData?.remainingDays,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      // 1. Fetch user data from database
      const user = await this.getUserData({ userId: context.userId });

      // 2. Prepare email props
      const remainingDays = (context.additionalData?.remainingDays as number) || 3;
      const emailProps: MailTemplateProps<MailTemplateId.SUBSCRIPTION_TRIAL_END> = {
        endedAtISO: new Date(Date.now() + remainingDays * 24 * 60 * 60 * 1000).toISOString(),
        locale: Locale.EN_US,
      };

      // 3. Send trial 3 days left email
      await this.sendEmail(
        MailTemplateId.SUBSCRIPTION_TRIAL_END, // Using trial end template for 3 days left
        user.email,
        'Your trial ends in 3 days!',
        emailProps,
      );

      this.logger.info('Trial 3 days left email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        remainingDays,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `trial-3d-left-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.TRIAL_3D_LEFT,
          remainingDays,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process trial 3 days left email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class TrialEndMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing trial end email notification', {
        userId: context.userId,
        endedAtISO: context.additionalData?.endedAtISO,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      // 1. Fetch user data from database
      const user = await this.getUserData({ userId: context.userId });

      // 2. Prepare email props
      const endedAtISO = (context.additionalData?.endedAtISO as string) || new Date().toISOString();
      const emailProps: MailTemplateProps<MailTemplateId.SUBSCRIPTION_TRIAL_END> = {
        endedAtISO,
        locale: Locale.EN_US,
      };

      // 3. Send trial end email
      await this.sendEmail(
        MailTemplateId.SUBSCRIPTION_TRIAL_END,
        user.email,
        'Your trial has ended',
        emailProps,
      );

      this.logger.info('Trial end email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        endedAtISO,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `trial-end-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.TRIAL_END,
          endedAtISO,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process trial end email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class SubscriptionActiveMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing subscription active email notification', {
        userId: context.userId,
        planName: context.additionalData?.planName,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      // 1. Fetch user data from database
      const user = await this.getUserData({ userId: context.userId });

      // 2. Prepare email props
      const planName = (context.additionalData?.planName as string) || 'Premium Plan';
      const emailProps: MailTemplateProps<MailTemplateId.SUBSCRIPTION_ACTIVE> = {
        planName,
        amount: 9.99, // TODO: Get from subscription
        currency: Currency.USD, // TODO: Get from user preferences
        startedAtISO: new Date().toISOString(),
        nextChargeISO: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        billingPeriod: BillingCycle.MONTHLY, // TODO: Get from subscription
        locale: Locale.EN_US,
      };

      // 3. Send subscription active email
      await this.sendEmail(
        MailTemplateId.SUBSCRIPTION_ACTIVE,
        user.email,
        'Welcome to your subscription!',
        emailProps,
      );

      this.logger.info('Subscription active email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        planName,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `subscription-active-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.SUBSCRIPTION_ACTIVE,
          planName,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process subscription active email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class SubscriptionPastDueMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    try {
      this.logger.info('Processing subscription past due email notification', {
        userId: context.userId,
        invoiceUrl: context.additionalData?.invoiceUrl,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      // 1. Fetch user data from database
      const user = await this.getUserData({ userId: context.userId });

      // 2. Prepare email props
      const invoiceUrl = context.additionalData?.invoiceUrl as string;
      const emailProps: MailTemplateProps<MailTemplateId.SUBSCRIPTION_PAST_DUE> = {
        planName: 'Premium Plan', // TODO: Get from subscription
        currency: Currency.USD, // TODO: Get from user preferences
        billingPeriod: BillingCycle.MONTHLY, // TODO: Get from subscription
        amountDue: 9.99, // TODO: Get from subscription
        locale: Locale.EN_US,
        ...(invoiceUrl && { payUrl: invoiceUrl }),
      };

      // 3. Send subscription past due email
      await this.sendEmail(
        MailTemplateId.SUBSCRIPTION_PAST_DUE,
        user.email,
        'Payment required for your subscription',
        emailProps,
      );

      this.logger.info('Subscription past due email sent successfully', {
        userId: context.userId,
        userEmail: user.email,
        invoiceUrl,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: true,
        messageId: `subscription-past-due-${context.userId}-${Date.now()}`,
        metadata: {
          transporter: NotificationTransporterType.MAIL,
          event: NotificationEventType.SUBSCRIPTION_PAST_DUE,
          invoiceUrl,
          userEmail: user.email,
        },
      };
    } catch (error) {
      this.logger.error('Failed to process subscription past due email notification', {
        userId: context.userId,
        error: error as Error,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return {
        success: false,
        error: error as Error,
      };
    }
  }
}

export class ResetPasswordMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    this.logger.info('Processing reset password email notification', {
      userId: context.userId,
      correlationId: context.correlationId,
      requestId: context.requestId,
    });
    return {
      success: true,
      messageId: `reset-password-${context.userId}-${Date.now()}`,
      metadata: {
        transporter: NotificationTransporterType.MAIL,
        event: NotificationEventType.RESET_PASSWORD,
      },
    };
  }
}

export class MagicLinkMailHandler extends BaseMailHandler {
  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    this.logger.info('Processing magic link email notification', {
      userId: context.userId,
      correlationId: context.correlationId,
      requestId: context.requestId,
    });
    return {
      success: true,
      messageId: `magic-link-${context.userId}-${Date.now()}`,
      metadata: {
        transporter: NotificationTransporterType.MAIL,
        event: NotificationEventType.MAGIC_LINK,
      },
    };
  }
}
