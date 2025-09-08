import { SubscriptionTier } from '../enums/subscription/subscriptionTier.enum';

export const SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES: Record<SubscriptionTier, number> = {
  [SubscriptionTier.STANDARD]: 60,
  [SubscriptionTier.MAX]: 60,
};

export const SUBSCRIPTION_TIER_PRICES: Record<
  'monthly' | 'annual',
  Record<SubscriptionTier, number>
> = {
  monthly: {
    [SubscriptionTier.STANDARD]: 1999,
    [SubscriptionTier.MAX]: 2999,
  },
  annual: {
    [SubscriptionTier.STANDARD]: 19999,
    [SubscriptionTier.MAX]: 29999,
  },
};

const SHARED_FEATURES = [
  'Voice Chat',
  'Streaks',
  'XP',
  'Goal Tracking',
  'Journal',
  'Gratitude & Reflections',
];

export const SUBSCRIPTION_TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  [SubscriptionTier.STANDARD]: [...SHARED_FEATURES],
  [SubscriptionTier.MAX]: [
    ...SHARED_FEATURES,
    'Text Chat',
    'High Quality Voices',
    'Mood Trends & Weekly Insights',
  ],
};
