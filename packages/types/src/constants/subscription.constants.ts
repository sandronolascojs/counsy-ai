import { SubscriptionTier } from '../enums/subscription/subscriptionTier.enum';

export const SUBSCRIPTION_TIER_AMOUNT_OF_HOURS: Record<SubscriptionTier, number> = {
  [SubscriptionTier.STANDARD]: 1,
  [SubscriptionTier.MAX]: 1,
};
