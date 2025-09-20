import { Logger } from '@counsy-ai/shared';
import { NotificationEventType } from '@counsy-ai/types';
import { NotificationHandlerMap } from '../types';

// Placeholder SMS handlers - to be implemented when SMS functionality is needed
class PlaceholderSmsHandler {
  constructor(
    private readonly logger: Logger,
    private readonly eventType: NotificationEventType,
  ) {}

  async handle(): Promise<{ success: boolean; error?: Error }> {
    this.logger.warn('SMS notification handler not implemented', {
      eventType: this.eventType,
    });

    return {
      success: true, // Return success to avoid blocking the queue
    };
  }
}

export const createSmsHandlers = (logger: Logger): NotificationHandlerMap => ({
  [NotificationEventType.WELCOME]: new PlaceholderSmsHandler(logger, NotificationEventType.WELCOME),
  [NotificationEventType.TRIAL_START]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.TRIAL_START,
  ),
  [NotificationEventType.TRIAL_3D_LEFT]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.TRIAL_3D_LEFT,
  ),
  [NotificationEventType.TRIAL_END]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.TRIAL_END,
  ),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.SUBSCRIPTION_ACTIVE,
  ),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.SUBSCRIPTION_PAST_DUE,
  ),
  [NotificationEventType.RESET_PASSWORD]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.RESET_PASSWORD,
  ),
  [NotificationEventType.MAGIC_LINK]: new PlaceholderSmsHandler(
    logger,
    NotificationEventType.MAGIC_LINK,
  ),
});
