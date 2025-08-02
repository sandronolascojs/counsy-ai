import { SubscriptionVendor } from '@counsy-ai/types';
import { pgEnum } from 'drizzle-orm/pg-core';

export const subscriptionChannel = pgEnum('subscription_channel', [
  SubscriptionVendor.APPLE_IAP,
  SubscriptionVendor.GOOGLE_PLAY,
  SubscriptionVendor.STRIPE,
]);
