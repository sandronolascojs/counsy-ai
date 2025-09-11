import {
  CountryCode,
  errorsSchema,
  RevenueCatEnvironment,
  RevenueCatEventType,
  RevenueCatPeriodType,
  RevenueCatStore,
} from '@counsy-ai/types';
import { initContract } from '@ts-rest/core';
import z from 'zod';

const c = initContract();

export const SubscriberAttributeItemSchema = z.object({
  updated_at_ms: z.number(),
  value: z.string(),
});
export type SubscriberAttributeItem = z.infer<typeof SubscriberAttributeItemSchema>;

export const SubscriberAttributesSchema = z.object({}).catchall(SubscriberAttributeItemSchema);
export type SubscriberAttributes = z.infer<typeof SubscriberAttributesSchema>;

export const EventSchema = z.object({
  aliases: z.array(z.string()),
  app_id: z.string(),
  app_user_id: z.string(),
  commission_percentage: z.number().nullable(),
  country_code: z.nativeEnum(CountryCode),
  currency: z.string().nullable(),
  entitlement_id: z.string().nullable(),
  entitlement_ids: z.array(z.string()).nullable(),
  environment: z.nativeEnum(RevenueCatEnvironment),
  event_timestamp_ms: z.number(),
  expiration_at_ms: z.number(),
  id: z.string(),
  is_family_share: z.boolean().nullable(),
  metadata: z.record(z.unknown()).nullable(),
  offer_code: z.string().nullable(),
  original_app_user_id: z.string(),
  original_transaction_id: z.string().nullable(),
  period_type: z.nativeEnum(RevenueCatPeriodType),
  presented_offering_id: z.string().nullable(),
  price: z.number().nullable(),
  price_in_purchased_currency: z.number().nullable(),
  product_id: z.string(),
  purchased_at_ms: z.number(),
  renewal_number: z.number().nullable(),
  store: z.nativeEnum(RevenueCatStore),
  subscriber_attributes: SubscriberAttributesSchema,
  takehome_percentage: z.number().nullable(),
  tax_percentage: z.number().nullable(),
  transaction_id: z.string().nullable(),
  type: z.nativeEnum(RevenueCatEventType),
});
export type Event = z.infer<typeof EventSchema>;

export const RevenueCatPayloadSchema = z.object({
  api_version: z.string(),
  event: EventSchema,
});
export type RevenueCatPayload = z.infer<typeof RevenueCatPayloadSchema>;

export const publicRouter = c.router({
  revenueCatWebhook: {
    method: 'POST',
    path: '/public/webhook/revenuecat',
    body: RevenueCatPayloadSchema,
    responses: {
      200: z.void(),
      ...errorsSchema,
    },
  },
});
