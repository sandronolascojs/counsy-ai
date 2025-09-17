import {
  subscriptions,
  type InsertSubscription,
  type SelectSubscription,
  type UpdateSubscription,
} from '@counsy-ai/db/schema';
import { BaseRepository } from '@counsy-ai/shared';
import { eq } from 'drizzle-orm';

export class SubscriptionRepository extends BaseRepository {
  async createSubscription({ subscription }: { subscription: InsertSubscription }): Promise<void> {
    await this.db.insert(subscriptions).values(subscription);
  }

  async getSubscriptionById({
    subscriptionId,
  }: {
    subscriptionId: string;
  }): Promise<SelectSubscription | undefined> {
    return await this.db.query.subscriptions.findFirst({
      where: eq(subscriptions.subscriptionId, subscriptionId),
    });
  }

  async getSubscriptionByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<SelectSubscription | undefined> {
    return await this.db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    });
  }

  async updateSubscription({
    subscriptionId,
    subscription,
  }: {
    subscriptionId: string;
    subscription: UpdateSubscription;
  }): Promise<void> {
    await this.db
      .update(subscriptions)
      .set(subscription)
      .where(eq(subscriptions.subscriptionId, subscriptionId));
  }
}
