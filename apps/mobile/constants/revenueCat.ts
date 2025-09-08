import { BillingCycle, SubscriptionTier } from '@counsy-ai/types';

// Types
export type BillingCycleKey = 'weekly' | 'monthly' | 'annual';

// Local fallback product IDs (used only if the backend catalog is not ready yet)
export const PRODUCT_IDS_FALLBACK: Record<
  SubscriptionTier,
  Partial<Record<BillingCycleKey, string>>
> = {
  [SubscriptionTier.STANDARD]: {
    monthly: 'counsy_standard_monthly',
    annual: 'counsy_standard_annual',
    // weekly: 'counsy_standard_weekly', // add when you have it in the store
  },
  [SubscriptionTier.MAX]: {
    monthly: 'counsy_max_monthly',
    annual: 'counsy_max_annual',
    // weekly: 'counsy_max_weekly', // add when you have it in the store
  },
};

// Map between your SubscriptionTier enum and the entitlement keys in RevenueCat
export const ENTITLEMENT_BY_TIER: Record<SubscriptionTier, string> = {
  [SubscriptionTier.STANDARD]: 'standard',
  [SubscriptionTier.MAX]: 'max',
};

// Normalize BillingCycle enum into lowercase keys
export function toCycleKey(cycle: BillingCycle): BillingCycleKey {
  switch (cycle) {
    case BillingCycle.WEEKLY:
      return 'weekly';
    case BillingCycle.ANNUAL:
      return 'annual';
    case BillingCycle.MONTHLY:
    default:
      return 'monthly';
  }
}
