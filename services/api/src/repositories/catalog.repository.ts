import { planChannelPrices, planChannelProducts, plans } from '@counsy-ai/db/schema';
import { BaseRepository } from '@counsy-ai/shared';
import type { BillingCycle, SubscriptionVendor } from '@counsy-ai/types';
import { eq, isNull } from 'drizzle-orm';

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
      .leftJoin(
        planChannelPrices,
        eq(planChannelProducts.planChannelProductId, planChannelPrices.planChannelProductId),
      );

    // Apply filters
    const conditions = [isNull(planChannelPrices.effectiveTo), isNull(planChannelPrices.deletedAt)];
    if (query?.channel) {
      conditions.push(eq(planChannelProducts.channel, query.channel));
    }
    if (query?.billingCycle) {
      conditions.push(eq(planChannelProducts.billingCycle, query.billingCycle));
    }

    if (conditions.length > 0) {
      dbQuery.where(conditions[0]);
      for (let i = 1; i < conditions.length; i++) {
        dbQuery.where(conditions[i]);
      }
    }

    return await dbQuery;
  }
}
