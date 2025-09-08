import { CatalogRepository } from '@/repositories/catalog.repository';
import type { DB } from '@counsy-ai/db';
import type { Logger } from '@counsy-ai/shared';
import type { BillingCycle, SubscriptionVendor } from '@counsy-ai/types';

export class CatalogService {
  private readonly catalogRepository: CatalogRepository;

  constructor(
    private readonly db: DB,
    private readonly logger: Logger,
  ) {
    this.db = db;
    this.logger = logger;
    this.catalogRepository = new CatalogRepository(this.db, this.logger);
  }

  async getCatalog({
    query,
  }: {
    query?: {
      channel?: SubscriptionVendor;
      billingCycle?: BillingCycle;
    };
  }) {
    const catalog = await this.catalogRepository.getCatalog({ query });
    // Group products by plan
    const planMap = new Map<
      string,
      {
        planId: string;
        name: string;
        minutesIncluded: number;
        features: string[];
        products: {
          planChannelProductId: string;
          channel: SubscriptionVendor;
          externalProductId: string;
          unitAmount: number;
          currency: string;
          billingCycle: BillingCycle;
        }[];
        createdAt: string;
      }
    >();

    for (const item of catalog) {
      if (!item.planId) continue;

      if (!planMap.has(item.planId)) {
        planMap.set(item.planId, {
          planId: item.planId,
          name: item.name,
          minutesIncluded: item.minutesIncluded,
          features: item.features || [],
          products: [],
          createdAt: item.createdAt.toISOString(),
        });
      }

      const plan = planMap.get(item.planId);
      if (!plan) continue;

      // Only add product if it has all required fields
      if (item.planChannelProductId && item.externalProductId) {
        plan.products.push({
          planChannelProductId: item.planChannelProductId,
          channel: item.channel,
          externalProductId: item.externalProductId,
          unitAmount: item.unitAmount || 0,
          currency: item.currency,
          billingCycle: item.billingCycle,
        });
      }
    }

    return Array.from(planMap.values());
  }
}
