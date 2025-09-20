import { z } from 'zod';
import {
  MailTemplateId,
  NotificationEventType,
  NotificationTransporterType,
  type QueueNames,
} from '../enums';
import type { MailTemplateProps } from './emailTemplates';

// Base metadata all notifications share
export const NotificationBaseMetaSchema = z.object({
  userId: z.string().min(1),
});

export type NotificationBaseMeta = z.infer<typeof NotificationBaseMetaSchema>;

// Event types (WELCOME, TRIAL, etc.)
export const NotificationEventSchema = z.nativeEnum(NotificationEventType);
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;

// Transporter types (MAIL, EXPO)
export const NotificationTransporterSchema = z.nativeEnum(NotificationTransporterType);
export type NotificationTransporter = z.infer<typeof NotificationTransporterSchema>;

export const MailPayloadSchema = z.object({
  templateId: z.nativeEnum(MailTemplateId),
  to: z.string().email(),
  subject: z.string(),
});
export type MailPayload = z.infer<typeof MailPayloadSchema>;

// Expo push payload follows Expo spec
export const ExpoPushPayloadSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  sound: z.union([z.literal('default'), z.string()]).optional(),
  badge: z.number().optional(),
  priority: z.enum(['default', 'normal', 'high']).optional(),
});
export type ExpoPushPayload = z.infer<typeof ExpoPushPayloadSchema>;

// Discriminated union envelope by transporter type
export const NotificationEnvelopeSchema = z.discriminatedUnion('transporter', [
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: NotificationEventSchema,
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadSchema,
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: NotificationEventSchema,
    meta: NotificationBaseMetaSchema,
    payload: ExpoPushPayloadSchema,
    requestId: z.string().optional(),
  }),
]);
export type NotificationEnvelope = z.infer<typeof NotificationEnvelopeSchema>;

// Event-specific payloads per transporter
const MailPayloadByEventSchema = {
  [NotificationEventType.WELCOME]: MailPayloadSchema.extend({
    templateId: z.literal(MailTemplateId.WELCOME),
    data: z.object({ firstName: z.string() }).passthrough(),
  }),
  [NotificationEventType.TRIAL_START]: MailPayloadSchema.extend({
    templateId: z.literal(MailTemplateId.SUBSCRIPTION_TRIAL_START),
    data: z.object({ trialDays: z.number().int().positive() }).passthrough(),
  }),
  [NotificationEventType.TRIAL_END]: MailPayloadSchema.extend({
    templateId: z.literal(MailTemplateId.SUBSCRIPTION_TRIAL_END),
    data: z.object({ endedAtISO: z.string() }).passthrough(),
  }),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: MailPayloadSchema.extend({
    templateId: z.literal(MailTemplateId.SUBSCRIPTION_ACTIVE),
    data: z.object({ planName: z.string() }).passthrough(),
  }),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: MailPayloadSchema.extend({
    templateId: z.literal(MailTemplateId.SUBSCRIPTION_PAST_DUE),
    data: z.object({ invoiceUrl: z.string().url().optional() }).passthrough(),
  }),
} as const;

const ExpoPayloadByEventSchema = {
  [NotificationEventType.WELCOME]: ExpoPushPayloadSchema.extend({
    data: z.object({}).passthrough().optional(),
  }),
  [NotificationEventType.TRIAL_START]: ExpoPushPayloadSchema.extend({
    data: z.object({ trialDays: z.number().int().positive() }).passthrough(),
  }),
  [NotificationEventType.TRIAL_3D_LEFT]: ExpoPushPayloadSchema.extend({
    data: z.object({ remainingDays: z.number().int().positive() }).passthrough(),
  }),
  [NotificationEventType.TRIAL_END]: ExpoPushPayloadSchema.extend({
    data: z.object({ endedAtISO: z.string() }).passthrough(),
  }),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: ExpoPushPayloadSchema.extend({
    data: z.object({ planName: z.string() }).passthrough(),
  }),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: ExpoPushPayloadSchema.extend({
    data: z.object({ invoiceUrl: z.string().url().optional() }).passthrough(),
  }),
} as const;

const MailEventEnvelopes = [
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: z.literal(NotificationEventType.WELCOME),
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadByEventSchema[NotificationEventType.WELCOME],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: z.literal(NotificationEventType.TRIAL_START),
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadByEventSchema[NotificationEventType.TRIAL_START],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: z.literal(NotificationEventType.TRIAL_END),
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadByEventSchema[NotificationEventType.TRIAL_END],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: z.literal(NotificationEventType.SUBSCRIPTION_ACTIVE),
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadByEventSchema[NotificationEventType.SUBSCRIPTION_ACTIVE],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.MAIL),
    event: z.literal(NotificationEventType.SUBSCRIPTION_PAST_DUE),
    meta: NotificationBaseMetaSchema,
    payload: MailPayloadByEventSchema[NotificationEventType.SUBSCRIPTION_PAST_DUE],
    requestId: z.string().optional(),
  }),
] as const;

const ExpoEventEnvelopes = [
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.WELCOME),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.WELCOME],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.TRIAL_START),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.TRIAL_START],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.TRIAL_3D_LEFT),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.TRIAL_3D_LEFT],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.TRIAL_END),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.TRIAL_END],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.SUBSCRIPTION_ACTIVE),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.SUBSCRIPTION_ACTIVE],
    requestId: z.string().optional(),
  }),
  z.object({
    transporter: z.literal(NotificationTransporterType.EXPO),
    event: z.literal(NotificationEventType.SUBSCRIPTION_PAST_DUE),
    meta: NotificationBaseMetaSchema,
    payload: ExpoPayloadByEventSchema[NotificationEventType.SUBSCRIPTION_PAST_DUE],
    requestId: z.string().optional(),
  }),
] as const;

export const NotificationEnvelopeByEventSchema = z.union([
  ...MailEventEnvelopes,
  ...ExpoEventEnvelopes,
] as [
  (typeof MailEventEnvelopes)[number] | (typeof ExpoEventEnvelopes)[number],
  (typeof MailEventEnvelopes)[number] | (typeof ExpoEventEnvelopes)[number],
  ...((typeof MailEventEnvelopes)[number] | (typeof ExpoEventEnvelopes)[number])[],
]);
export type NotificationEnvelopeByEvent = z.infer<typeof NotificationEnvelopeByEventSchema>;

// ==== Typed SNS Queue Payloads (for generic producer) ====

// Map each MailTemplateId to its strict props type
type MailTemplatePropsWithoutLocale<T extends MailTemplateId> = Omit<
  MailTemplateProps<T>,
  'locale'
>;

type EmailPayloadByTemplate = {
  [K in MailTemplateId]: {
    template: K;
    to: string;
    subject: string;
    // Producer payload does NOT include locale; consumer injects it before render
    props?: MailTemplatePropsWithoutLocale<K>;
  };
};

export type NotificationsEmailQueuePayload = EmailPayloadByTemplate[MailTemplateId];

// Import the new lightweight notification queue payload
import { NotificationQueuePayload } from '../queues/notificationQueue.types';

export interface NotificationsQueues {
  [QueueNames.NOTIFICATIONS]: NotificationQueuePayload;
}
