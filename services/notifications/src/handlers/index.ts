export { NotificationDispatcher } from './notificationDispatcher';
export type {
  NotificationHandler,
  NotificationHandlerContext,
  NotificationHandlerMap,
  NotificationHandlerResult,
  TransporterHandlerMap,
} from './types';

// Export individual transporter handlers
export { createExpoHandlers } from './expo';
export { createInAppHandlers } from './in_app';
export { createMailHandlers } from './mail';
export { createSmsHandlers } from './sms';
