import { NotificationEventType, NotificationTransporterType } from '@counsy-ai/types';

export interface NotificationHandlerContext {
  userId: string;
  notificationType: NotificationEventType;
  transporterType: NotificationTransporterType;
  additionalData?: Record<string, unknown>;
  correlationId?: string;
  requestId?: string;
}

export interface NotificationHandlerResult {
  success: boolean;
  messageId?: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

export interface NotificationHandler {
  handle(context: NotificationHandlerContext): Promise<NotificationHandlerResult>;
}

export interface NotificationHandlerMap {
  [NotificationEventType.WELCOME]: NotificationHandler;
  [NotificationEventType.TRIAL_START]: NotificationHandler;
  [NotificationEventType.TRIAL_3D_LEFT]: NotificationHandler;
  [NotificationEventType.TRIAL_END]: NotificationHandler;
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: NotificationHandler;
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: NotificationHandler;
  [NotificationEventType.RESET_PASSWORD]: NotificationHandler;
  [NotificationEventType.MAGIC_LINK]: NotificationHandler;
}

export interface TransporterHandlerMap {
  [NotificationTransporterType.MAIL]: NotificationHandlerMap;
  [NotificationTransporterType.EXPO]: NotificationHandlerMap;
  [NotificationTransporterType.SMS]: NotificationHandlerMap;
  [NotificationTransporterType.IN_APP]: NotificationHandlerMap;
}
