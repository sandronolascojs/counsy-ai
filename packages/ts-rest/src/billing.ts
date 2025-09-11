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
});
