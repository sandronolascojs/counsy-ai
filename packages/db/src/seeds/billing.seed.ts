import {
  BillingCycle,
  Currency,
  SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES,
  SUBSCRIPTION_TIER_FEATURES,
  SUBSCRIPTION_TIER_PRICES,
  SubscriptionTier,
  SubscriptionVendor,
} from '@counsy-ai/types';
import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import type {
  SelectPlan,
  SelectPlanChannelPrice,
  SelectPlanChannelProduct,
} from '../schema/billing';
import { planChannelPrices, planChannelProducts, plans } from '../schema/billing';

type PlanName = SubscriptionTier.STANDARD | SubscriptionTier.MAX;

// ---------- Config de productos Apple ----------
const APPLE = SubscriptionVendor.APPLE_IAP;
const USD = Currency.USD;

// Product IDs (de App Store Connect / RevenueCat)
const PRODUCT_IDS = {
  STANDARD: {
    monthly: 'counsy_standard_monthly',
    annual: 'counsy_standard_annual',
  },
  MAX: {
    monthly: 'counsy_max_monthly',
    annual: 'counsy_max_annual',
  },
} as const;

const PRICES_USD = {
  STANDARD: {
    monthly: SUBSCRIPTION_TIER_PRICES.monthly[SubscriptionTier.STANDARD],
    annual: SUBSCRIPTION_TIER_PRICES.annual[SubscriptionTier.STANDARD],
  },
  MAX: {
    monthly: SUBSCRIPTION_TIER_PRICES.monthly[SubscriptionTier.MAX],
    annual: SUBSCRIPTION_TIER_PRICES.annual[SubscriptionTier.MAX],
  },
} as const;

const PLAN_META: Record<
  PlanName,
  { externalProductId: string; billingCycle: BillingCycle; minutes: number; features: string[] }[]
> = {
  [SubscriptionTier.STANDARD]: [
    {
      externalProductId: PRODUCT_IDS.STANDARD.monthly,
      billingCycle: BillingCycle.MONTHLY,
      minutes: SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES[SubscriptionTier.STANDARD],
      features: SUBSCRIPTION_TIER_FEATURES[SubscriptionTier.STANDARD],
    },
    {
      externalProductId: PRODUCT_IDS.STANDARD.annual,
      billingCycle: BillingCycle.ANNUAL,
      minutes: SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES[SubscriptionTier.STANDARD],
      features: SUBSCRIPTION_TIER_FEATURES[SubscriptionTier.STANDARD],
    },
  ],
  [SubscriptionTier.MAX]: [
    {
      externalProductId: PRODUCT_IDS.MAX.monthly,
      billingCycle: BillingCycle.MONTHLY,
      minutes: SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES[SubscriptionTier.MAX],
      features: SUBSCRIPTION_TIER_FEATURES[SubscriptionTier.MAX],
    },
    {
      externalProductId: PRODUCT_IDS.MAX.annual,
      billingCycle: BillingCycle.ANNUAL,
      minutes: SUBSCRIPTION_TIER_AMOUNT_OF_MINUTES[SubscriptionTier.MAX],
      features: SUBSCRIPTION_TIER_FEATURES[SubscriptionTier.MAX],
    },
  ],
};

async function upsertPlan(name: PlanName): Promise<SelectPlan> {
  const existing = await db.select().from(plans).where(eq(plans.name, name)).limit(1);
  if (existing.length && existing[0]) {
    return existing[0];
  }

  const metaArray = PLAN_META[name];
  const meta = metaArray[0];
  if (!meta) throw new Error(`No meta found for plan ${name}`);
  const inserted = await db
    .insert(plans)
    .values({
      name,
      minutesIncluded: meta.minutes,
      features: meta.features,
    })
    .returning();
  const created = inserted[0];
  if (!created) throw new Error(`Failed to create plan ${name}`);
  return created;
}

async function upsertPlanChannelProduct({
  planId,
  channel,
  externalId,
  billingCycle,
}: {
  planId: string;
  channel: SubscriptionVendor;
  externalId: string;
  currency: Currency;
  billingCycle: BillingCycle;
}): Promise<SelectPlanChannelProduct> {
  const byExternal = await db
    .select()
    .from(planChannelProducts)
    .where(
      and(
        eq(planChannelProducts.externalProductId, externalId),
        eq(planChannelProducts.channel, channel),
      ),
    )
    .limit(1);

  if (byExternal.length && byExternal[0]) {
    return byExternal[0];
  }

  const inserted = await db
    .insert(planChannelProducts)
    .values({
      planId,
      channel,
      externalProductId: externalId,
      billingCycle: billingCycle,
    })
    .returning();
  const created = inserted[0];
  if (!created) throw new Error(`Failed to create product ${externalId}`);
  return created;
}

async function upsertPlanChannelPrice({
  productId,
  unitAmountCents,
}: {
  productId: string;
  unitAmountCents: number;
}): Promise<SelectPlanChannelPrice> {
  const existing = await db
    .select()
    .from(planChannelPrices)
    .where(eq(planChannelPrices.planChannelProductId, productId))
    .limit(1);

  if (existing.length) {
    const updated = await db
      .update(planChannelPrices)
      .set({
        unitAmount: unitAmountCents,
        effectiveFrom: new Date(),
        effectiveTo: null,
        deletedAt: null,
      })
      .where(eq(planChannelPrices.planChannelProductId, productId))
      .returning();
    const updatedRecord = updated[0];
    if (!updatedRecord) throw new Error(`Failed to update price for product ${productId}`);
    return updatedRecord;
  }

  const inserted = await db
    .insert(planChannelPrices)
    .values({
      planChannelProductId: productId,
      unitAmount: unitAmountCents,
      effectiveFrom: new Date(),
      effectiveTo: null,
      deletedAt: null,
    })
    .returning();
  const created = inserted[0];
  if (!created) throw new Error(`Failed to create price for product ${productId}`);
  return created;
}

function getPriceForExternalId(externalProductId: string): number {
  if (externalProductId === PRODUCT_IDS.STANDARD.monthly) return PRICES_USD.STANDARD.monthly;
  if (externalProductId === PRODUCT_IDS.STANDARD.annual) return PRICES_USD.STANDARD.annual;
  if (externalProductId === PRODUCT_IDS.MAX.monthly) return PRICES_USD.MAX.monthly;
  if (externalProductId === PRODUCT_IDS.MAX.annual) return PRICES_USD.MAX.annual;
  throw new Error(`Unknown externalProductId price mapping: ${externalProductId}`);
}

export async function seedApple() {
  console.log('Seeding Apple IAP products…');

  const standard = await upsertPlan(SubscriptionTier.STANDARD);
  const max = await upsertPlan(SubscriptionTier.MAX);

  const stdProducts = [] as { id: string }[];
  for (const meta of PLAN_META[SubscriptionTier.STANDARD]) {
    const prod = await upsertPlanChannelProduct({
      planId: standard.planId,
      channel: APPLE,
      externalId: meta.externalProductId,
      currency: USD,
      billingCycle: meta.billingCycle,
    });

    stdProducts.push({ id: prod.planChannelProductId });
  }

  const maxProducts = [] as { id: string }[];
  for (const meta of PLAN_META[SubscriptionTier.MAX]) {
    const prod = await upsertPlanChannelProduct({
      planId: max.planId,
      channel: APPLE,
      externalId: meta.externalProductId,
      currency: USD,
      billingCycle: meta.billingCycle,
    });

    maxProducts.push({ id: prod.planChannelProductId });
  }

  for (const meta of PLAN_META[SubscriptionTier.STANDARD]) {
    const price = getPriceForExternalId(meta.externalProductId);
    const prod = await db
      .select()
      .from(planChannelProducts)
      .where(
        and(
          eq(planChannelProducts.externalProductId, meta.externalProductId),
          eq(planChannelProducts.channel, APPLE),
        ),
      )
      .limit(1);

    if (!prod[0]) {
      throw new Error(
        `Product not found for externalId=${meta.externalProductId}, planId=${standard.planId}, channel=${APPLE}, billingCycle=${meta.billingCycle}`,
      );
    }

    await upsertPlanChannelPrice({
      productId: prod[0].planChannelProductId,
      unitAmountCents: price,
    });
  }

  for (const meta of PLAN_META[SubscriptionTier.MAX]) {
    const price = getPriceForExternalId(meta.externalProductId);
    const prod = await db
      .select()
      .from(planChannelProducts)
      .where(
        and(
          eq(planChannelProducts.externalProductId, meta.externalProductId),
          eq(planChannelProducts.channel, APPLE),
        ),
      )
      .limit(1);

    if (!prod[0]) {
      throw new Error(
        `Product not found for externalId=${meta.externalProductId}, planId=${max.planId}, channel=${APPLE}, billingCycle=${meta.billingCycle}`,
      );
    }

    await upsertPlanChannelPrice({
      productId: prod[0].planChannelProductId,
      unitAmountCents: price,
    });
  }

  console.log('Seed Apple IAP: OK');
}
