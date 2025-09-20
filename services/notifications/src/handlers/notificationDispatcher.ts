import { Logger } from '@counsy-ai/shared';
import { NotificationQueuePayload, NotificationTransporterType } from '@counsy-ai/types';
import { createExpoHandlers } from './expo';
import { createInAppHandlers } from './in_app';
import { createMailHandlers } from './mail';
import { createSmsHandlers } from './sms';
import {
  NotificationHandlerContext,
  NotificationHandlerResult,
  TransporterHandlerMap,
} from './types';

export class NotificationDispatcher {
  private readonly handlers: TransporterHandlerMap;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.handlers = {
      [NotificationTransporterType.MAIL]: createMailHandlers(logger),
      [NotificationTransporterType.EXPO]: createExpoHandlers(logger),
      [NotificationTransporterType.SMS]: createSmsHandlers(logger),
      [NotificationTransporterType.IN_APP]: createInAppHandlers(logger),
    };
  }

  async dispatch(payload: NotificationQueuePayload): Promise<NotificationHandlerResult> {
    const context: NotificationHandlerContext = {
      userId: payload.userId,
      notificationType: payload.notificationType,
      transporterType: payload.transporterType,
      additionalData: payload.additionalData,
    };

    this.logger.info('Dispatching notification', {
      userId: context.userId,
      notificationType: context.notificationType,
      transporterType: context.transporterType,
      correlationId: context.correlationId,
      requestId: context.requestId,
    });

    try {
      const transporterHandlers = this.handlers[context.transporterType];
      const handler = transporterHandlers[context.notificationType];

      const result = await handler.handle(context);

      this.logger.info('Notification dispatched successfully', {
        userId: context.userId,
        notificationType: context.notificationType,
        transporterType: context.transporterType,
        success: result.success,
        messageId: result.messageId,
        correlationId: context.correlationId,
        requestId: context.requestId,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to dispatch notification', {
        userId: context.userId,
        notificationType: context.notificationType,
        transporterType: context.transporterType,
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
