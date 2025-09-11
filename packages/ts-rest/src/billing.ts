import { BillingCycle, Currency, SubscriptionVendor, errorsSchema } from '@counsy-ai/types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const catalogItemSchema = z.object({
  planId: z.string(),
  name: z.string(),
  minutesIncluded: z.number(),
  features: z.array(z.string()),
  products: z.array(
    z.object({
      planChannelProductId: z.string(),
      channel: z.nativeEnum(SubscriptionVendor, {
        message: 'Invalid channel type',
      }),
      externalProductId: z.string(),
      currency: z.nativeEnum(Currency, {
        message: 'Invalid currency type',
      }),
      unitAmount: z.number(),
      billingCycle: z.nativeEnum(BillingCycle, {
        message: 'Invalid billing cycle type',
      }),
    }),
  ),
  createdAt: z.string(),
});

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
  commission_percentage: z.number(),
  country_code: z.string(),
  currency: z.string(),
  entitlement_id: z.string(),
  entitlement_ids: z.array(z.string()),
  environment: z.string(),
  event_timestamp_ms: z.number(),
  expiration_at_ms: z.number(),
  id: z.string(),
  is_family_share: z.boolean(),
  offer_code: z.string(),
  original_app_user_id: z.string(),
  original_transaction_id: z.string(),
  period_type: z.string(),
  presented_offering_id: z.string(),
  price: z.number(),
  price_in_purchased_currency: z.number(),
  product_id: z.string(),
  purchased_at_ms: z.number(),
  store: z.string(),
  subscriber_attributes: SubscriberAttributesSchema,
  takehome_percentage: z.number(),
  tax_percentage: z.number(),
  transaction_id: z.string(),
  type: z.string(),
});
export type Event = z.infer<typeof EventSchema>;

export const RevenueCatPayloadSchema = z.object({
  api_version: z.string(),
  event: EventSchema,
});
export type RevenueCatPayload = z.infer<typeof RevenueCatPayloadSchema>;

export const billingRouter = c.router({
  getCatalog: {
    method: 'GET',
    path: '/billing/catalog',
    query: z.object({
      channel: z
        .nativeEnum(SubscriptionVendor, {
          message: 'Invalid channel type',
        })
        .optional(),
    }),
    responses: {
      200: z.array(catalogItemSchema),
      ...errorsSchema,
    },
  },
  revenueCatWebhook: {
    method: 'POST',
    path: '/billing/revenuecat/webhook',
    body: RevenueCatPayloadSchema,
    responses: {
      200: z.void(),
      ...errorsSchema,
    },
  },
});
