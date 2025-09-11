import { planChannelProducts, type SelectPlanChannelProduct } from '@counsy-ai/db/schema';
import { BaseRepository } from '@counsy-ai/shared';
import { SubscriptionVendor } from '@counsy-ai/types';
import { and, eq } from 'drizzle-orm';

export class PlanChannelProductRepository extends BaseRepository {
  async getByExternalProductIdAndChannel({
    externalProductId,
    channel,
  }: {
    externalProductId: string;
    channel: SubscriptionVendor;
  }): Promise<SelectPlanChannelProduct | undefined> {
    return await this.db.query.planChannelProducts.findFirst({
      where: and(
        eq(planChannelProducts.externalProductId, externalProductId),
        eq(planChannelProducts.channel, channel),
      ),
    });
  }
}
