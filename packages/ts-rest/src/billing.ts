import { BillingCycle, SubscriptionVendor, errorsSchema } from '@counsy-ai/types';
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
      channel: z.enum([
        SubscriptionVendor.APPLE_IAP,
        SubscriptionVendor.GOOGLE_PLAY,
        SubscriptionVendor.STRIPE,
      ]),
      externalProductId: z.string(),
      currency: z.string(),
      unitAmount: z.number(),
      billingCycle: z.enum([BillingCycle.WEEKLY, BillingCycle.MONTHLY, BillingCycle.ANNUAL]),
    }),
  ),
  createdAt: z.string(),
});

export const billingRouter = c.router({
  getCatalog: {
    method: 'GET',
    path: '/billing/catalog',
    query: z.object({
      channel: z
        .enum(
          [SubscriptionVendor.APPLE_IAP, SubscriptionVendor.GOOGLE_PLAY, SubscriptionVendor.STRIPE],
          {
            message: 'Invalid channel type',
          },
        )
        .optional(),
    }),
    responses: {
      200: z.array(catalogItemSchema),
      ...errorsSchema,
    },
  },
});
