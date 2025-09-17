import { NotificationTransporterType, NotificationsQueueNames } from '@counsy-ai/types';

const TRANSPORTER_MAP: Record<string, NotificationTransporterType> = {
  MAIL: NotificationTransporterType.MAIL,
  EXPO: NotificationTransporterType.EXPO,
};

export function normalizeTransporterType(value: unknown): NotificationTransporterType {
  if (typeof value !== 'string') {
    throw new Error(`Invalid NotificationTransporterType: ${String(value)}`);
  }
  const upper = value.toUpperCase();
  const mapped = TRANSPORTER_MAP[upper];
  if (!mapped) throw new Error(`Invalid NotificationTransporterType: ${value}`);
  return mapped;
}

const QUEUE_TO_TRANSPORTER: Record<NotificationsQueueNames, NotificationTransporterType> = {
  [NotificationsQueueNames.EMAIL]: NotificationTransporterType.MAIL,
};

export function transporterForQueue(queue: NotificationsQueueNames): NotificationTransporterType {
  return QUEUE_TO_TRANSPORTER[queue];
}
