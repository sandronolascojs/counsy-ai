import { planChannelPrices, planChannelProducts, plans } from '@counsy-ai/db/schema';
import { BaseRepository } from '@counsy-ai/shared';
import type { BillingCycle, SubscriptionVendor } from '@counsy-ai/types';
import { and, eq, isNull } from 'drizzle-orm';

export class CatalogRepository extends BaseRepository {
  async getCatalog({
    query,
  }: {
    query?: {
      channel?: SubscriptionVendor;
      billingCycle?: BillingCycle;
    };
  }) {
    const dbQuery = this.db
      .select({
        planId: plans.planId,
        name: plans.name,
        minutesIncluded: plans.minutesIncluded,
        features: plans.features,
        planChannelProductId: planChannelProducts.planChannelProductId,
        channel: planChannelProducts.channel,
        externalProductId: planChannelProducts.externalProductId,
        unitAmount: planChannelPrices.unitAmount,
        currency: planChannelProducts.currency,
        billingCycle: planChannelProducts.billingCycle,
        createdAt: plans.createdAt,
        effectiveTo: planChannelPrices.effectiveTo,
        deletedAt: planChannelPrices.deletedAt,
      })
      .from(plans)
      .innerJoin(planChannelProducts, eq(plans.planId, planChannelProducts.planId))
      .innerJoin(
        planChannelPrices,
        and(
          eq(planChannelProducts.planChannelProductId, planChannelPrices.planChannelProductId),
          isNull(planChannelPrices.effectiveTo),
          isNull(planChannelPrices.deletedAt),
        ),
      );

    // Apply filters
    const conditions = [];
    if (query?.channel) {
      conditions.push(eq(planChannelProducts.channel, query.channel));
    }
    if (query?.billingCycle) {
      conditions.push(eq(planChannelProducts.billingCycle, query.billingCycle));
    }

    if (conditions.length > 0) {
      dbQuery.where(and(...conditions));
    }

    return await dbQuery;
  }
}
