import { Logger, TypedSnsProducer } from '@counsy-ai/shared';
import {
  NotificationEventType,
  NotificationQueuePayload,
  NotificationTransporterType,
  NotificationsQueueNames,
} from '@counsy-ai/types';

export interface NotificationServiceParams {
  snsProducer: TypedSnsProducer;
  logger: Logger;
}

export class NotificationService {
  private readonly snsProducer: TypedSnsProducer;
  private readonly logger: Logger;

  constructor({ snsProducer, logger }: NotificationServiceParams) {
    this.snsProducer = snsProducer;
    this.logger = logger;
  }

  async sendWelcomeNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.WELCOME,
      transporterType: params.transporterType,
    };

    await this.sendNotification(payload);
  }

  async sendTrialStartNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    trialDays: number;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.TRIAL_START,
      transporterType: params.transporterType,
      additionalData: {
        trialDays: params.trialDays,
      },
    };

    await this.sendNotification(payload);
  }

  async sendTrial3DaysLeftNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    remainingDays: number;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.TRIAL_3D_LEFT,
      transporterType: params.transporterType,
      additionalData: {
        remainingDays: params.remainingDays,
      },
    };

    await this.sendNotification(payload);
  }

  async sendTrialEndNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    endedAtISO: string;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.TRIAL_END,
      transporterType: params.transporterType,
      additionalData: {
        endedAtISO: params.endedAtISO,
      },
    };

    await this.sendNotification(payload);
  }

  async sendSubscriptionActiveNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    planName: string;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.SUBSCRIPTION_ACTIVE,
      transporterType: params.transporterType,
      additionalData: {
        planName: params.planName,
      },
    };

    await this.sendNotification(payload);
  }

  async sendSubscriptionPastDueNotification(params: {
    userId: string;
    transporterType: NotificationTransporterType;
    invoiceUrl?: string;
    correlationId?: string;
    requestId?: string;
  }): Promise<void> {
    const payload: NotificationQueuePayload = {
      userId: params.userId,
      notificationType: NotificationEventType.SUBSCRIPTION_PAST_DUE,
      transporterType: params.transporterType,
      additionalData: {
        invoiceUrl: params.invoiceUrl,
      },
    };

    await this.sendNotification(payload);
  }

  private async sendNotification(payload: NotificationQueuePayload): Promise<void> {
    try {
      this.logger.info('Sending notification to queue', {
        userId: payload.userId,
        notificationType: payload.notificationType,
        transporterType: payload.transporterType,
      });

      await this.snsProducer.sendToQueue(NotificationsQueueNames.NOTIFICATIONS, payload, {
        eventType: payload.notificationType,
        eventVersion: '1.0',
        source: 'api-service',
      });

      this.logger.info('Notification sent successfully', {
        userId: payload.userId,
        notificationType: payload.notificationType,
        transporterType: payload.transporterType,
      });
    } catch (error) {
      this.logger.error('Failed to send notification', {
        userId: payload.userId,
        notificationType: payload.notificationType,
        transporterType: payload.transporterType,
        error: error as Error,
      });
      throw error;
    }
  }
}
