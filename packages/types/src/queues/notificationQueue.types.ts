import { z } from 'zod';
import {
  NotificationEventType,
  NotificationTransporterType,
} from '../enums/notification/notificationType.enum';

// Base notification queue payload - only essential data
export const NotificationQueuePayloadSchema = z.object({
  userId: z.string().uuid(),
  notificationType: z.nativeEnum(NotificationEventType),
  transporterType: z.nativeEnum(NotificationTransporterType),
  // Optional additional data that might be needed for specific notifications
  additionalData: z.record(z.unknown()).optional(),
});

export type NotificationQueuePayload = z.infer<typeof NotificationQueuePayloadSchema>;

// Specific payload types for different notification events
export const WelcomeNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.WELCOME),
});

export const TrialStartNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.TRIAL_START),
  additionalData: z
    .object({
      trialDays: z.number().int().positive(),
    })
    .optional(),
});

export const Trial3DaysLeftNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.TRIAL_3D_LEFT),
  additionalData: z
    .object({
      remainingDays: z.number().int().positive(),
    })
    .optional(),
});

export const TrialEndNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.TRIAL_END),
  additionalData: z
    .object({
      endedAtISO: z.string(),
    })
    .optional(),
});

export const SubscriptionActiveNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.SUBSCRIPTION_ACTIVE),
  additionalData: z
    .object({
      planName: z.string(),
    })
    .optional(),
});

export const SubscriptionPastDueNotificationPayloadSchema = NotificationQueuePayloadSchema.extend({
  notificationType: z.literal(NotificationEventType.SUBSCRIPTION_PAST_DUE),
  additionalData: z
    .object({
      invoiceUrl: z.string().url().optional(),
    })
    .optional(),
});

// Union type for all notification payloads
export const TypedNotificationQueuePayloadSchema = z.union([
  WelcomeNotificationPayloadSchema,
  TrialStartNotificationPayloadSchema,
  Trial3DaysLeftNotificationPayloadSchema,
  TrialEndNotificationPayloadSchema,
  SubscriptionActiveNotificationPayloadSchema,
  SubscriptionPastDueNotificationPayloadSchema,
]);

export type TypedNotificationQueuePayload = z.infer<typeof TypedNotificationQueuePayloadSchema>;

// Export individual types
export type WelcomeNotificationPayload = z.infer<typeof WelcomeNotificationPayloadSchema>;
export type TrialStartNotificationPayload = z.infer<typeof TrialStartNotificationPayloadSchema>;
export type Trial3DaysLeftNotificationPayload = z.infer<
  typeof Trial3DaysLeftNotificationPayloadSchema
>;
export type TrialEndNotificationPayload = z.infer<typeof TrialEndNotificationPayloadSchema>;
export type SubscriptionActiveNotificationPayload = z.infer<
  typeof SubscriptionActiveNotificationPayloadSchema
>;
export type SubscriptionPastDueNotificationPayload = z.infer<
  typeof SubscriptionPastDueNotificationPayloadSchema
>;
