import type { Logger } from '@counsy-ai/shared';
import { NotificationEventType } from '@counsy-ai/types';
import {
  NotificationHandler,
  NotificationHandlerMap,
  type NotificationHandlerContext,
  type NotificationHandlerResult,
} from '../types';

class handler implements NotificationHandler {
  constructor(private readonly logger: Logger) {
    this.logger = logger;
  }

  handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    this.logger.info('Processing expo notification', {
      userId: context.userId,
      notificationType: context.notificationType,
      transporterType: context.transporterType,
      correlationId: context.correlationId,
      requestId: context.requestId,
    });
    return Promise.resolve({ success: true });
  }
}

export const createExpoHandlers = (logger: Logger): NotificationHandlerMap => ({
  [NotificationEventType.WELCOME]: new handler(logger),
  [NotificationEventType.TRIAL_START]: new handler(logger),
  [NotificationEventType.TRIAL_3D_LEFT]: new handler(logger),
  [NotificationEventType.TRIAL_END]: new handler(logger),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: new handler(logger),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: new handler(logger),
  [NotificationEventType.RESET_PASSWORD]: new handler(logger),
  [NotificationEventType.MAGIC_LINK]: new handler(logger),
});
