import type { DB } from '@counsy-ai/db';
import type {
  InsertSubscription,
  SelectSubscription,
  UpdateSubscription,
} from '@counsy-ai/db/schema';
import type { Logger } from '@counsy-ai/shared';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundError } from '../utils/errors/NotFoundError';

export class SubscriptionsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly logger: Logger,
    private readonly db: DB,
  ) {
    this.subscriptionRepository = new SubscriptionRepository(db, logger);
    this.userRepository = new UserRepository(db, logger);
  }

  async createSubscription({ subscription }: { subscription: InsertSubscription }): Promise<void> {
    await this.subscriptionRepository.createSubscription({ subscription });
  }

  async getSubscriptionByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<SelectSubscription | undefined> {
    const user = await this.userRepository.getUserById({ id: userId });
    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }
    return await this.subscriptionRepository.getSubscriptionByUserId({ userId: user.id });
  }

  async updateSubscription({
    subscriptionId,
    subscription,
  }: {
    subscriptionId: string;
    subscription: UpdateSubscription;
  }): Promise<void> {
    const subscriptionExists = await this.subscriptionRepository.getSubscriptionById({
      subscriptionId,
    });
    if (!subscriptionExists) {
      throw new NotFoundError({ message: 'Subscription not found' });
    }
    await this.subscriptionRepository.updateSubscription({ subscriptionId, subscription });
  }
}
