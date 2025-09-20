import { Logger } from '@counsy-ai/shared';
import { NotificationEventType } from '@counsy-ai/types';
import {
  NotificationHandlerMap,
  type NotificationHandler,
  type NotificationHandlerContext,
  type NotificationHandlerResult,
} from '../types';

// Placeholder IN_APP handlers - to be implemented when in-app notification functionality is needed
class PlaceholderInAppHandler implements NotificationHandler {
  constructor(private readonly logger: Logger) {
    this.logger = logger;
  }

  async handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult> {
    this.logger.warn('In-app notification handler not implemented', {
      eventType: context.notificationType,
    });

    return {
      success: true, // Return success to avoid blocking the queue
    };
  }
}

export const createInAppHandlers = (logger: Logger): NotificationHandlerMap => ({
  [NotificationEventType.WELCOME]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.TRIAL_START]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.TRIAL_3D_LEFT]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.TRIAL_END]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.RESET_PASSWORD]: new PlaceholderInAppHandler(logger),
  [NotificationEventType.MAGIC_LINK]: new PlaceholderInAppHandler(logger),
});
