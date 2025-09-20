import { PlanChannelProductRepository } from '@/repositories/planChannelProduct.repository';
import type { DB } from '@counsy-ai/db';
import type { InsertSubscription } from '@counsy-ai/db/schema';
import {
  BaseSubscriptionRepository,
  BaseUserRepository,
  ConflictError,
  Logger,
  NotFoundError,
} from '@counsy-ai/shared';
import type { RevenueCatPayload } from '@counsy-ai/ts-rest';
import {
  NotificationTransporterType,
  RevenueCatEventType,
  RevenueCatPeriodType,
  SubscriptionPeriodType,
  SubscriptionStatus,
  SubscriptionVendor,
} from '@counsy-ai/types';
import { NotificationService } from './notification.service';

export class RevenueCatWebhookService {
  private readonly userRepository: BaseUserRepository;
  private readonly subscriptionRepository: BaseSubscriptionRepository;
  private readonly planChannelProductRepository: PlanChannelProductRepository;
  private readonly notificationService: NotificationService;
  private readonly logger: Logger;

  constructor({
    db,
    logger,
    notificationService,
  }: {
    db: DB;
    logger: Logger;
    notificationService: NotificationService;
  }) {
    this.logger = logger;
    this.subscriptionRepository = new BaseSubscriptionRepository(db, logger);
    this.userRepository = new BaseUserRepository(db, logger);
    this.planChannelProductRepository = new PlanChannelProductRepository(db, logger);
    this.notificationService = notificationService;
  }

  private mapStoreToVendor(store: string): SubscriptionVendor {
    switch (store) {
      case 'APP_STORE':
      case 'MAC_APP_STORE':
        return SubscriptionVendor.APPLE_IAP;
      case 'PLAY_STORE':
        return SubscriptionVendor.GOOGLE_PLAY;
      default:
        return SubscriptionVendor.GOOGLE_PLAY;
    }
  }

  async handleEvent(payload: RevenueCatPayload): Promise<void> {
    const { event } = payload;

    switch (event.type) {
      case RevenueCatEventType.INITIAL_PURCHASE:
        await this.handleTrialInitialPurchase(event);
        return;
      default:
        throw new ConflictError({ message: `Unhandled RevenueCat event type: ${event.type}` });
    }
  }

  private async handleTrialInitialPurchase(event: RevenueCatPayload['event']): Promise<void> {
    if (event.period_type !== RevenueCatPeriodType.TRIAL) return;

    const user = await this.userRepository.getUserById({ id: event.app_user_id });
    if (!user) throw new NotFoundError({ message: 'User not found' });

    const channel = this.mapStoreToVendor(event.store);
    const product = await this.planChannelProductRepository.getByExternalProductIdAndChannel({
      externalProductId: event.product_id,
      channel,
    });

    if (!product) {
      this.logger.warn('PlanChannelProduct not found for webhook', {
        productId: event.product_id,
        channel,
      });
      throw new NotFoundError({ message: 'PlanChannelProduct not found' });
    }

    if (!product.planId) {
      this.logger.warn('PlanChannelProduct not found for webhook', {
        productId: event.product_id,
        channel,
      });
      throw new NotFoundError({ message: 'PlanChannelProduct not found' });
    }

    const startedAt = new Date(event.purchased_at_ms);
    const currentPeriodEnd = new Date(event.expiration_at_ms);
    const trialDurationMs = event.expiration_at_ms - event.purchased_at_ms;
    this.logger.info('Trial detected for user', { userId: user.id, trialDurationMs });

    const newSubscription: InsertSubscription = {
      userId: user.id,
      planId: product.planId,
      channel,
      externalId: event.original_transaction_id || event.transaction_id || undefined,
      status: SubscriptionStatus.ACTIVE,
      periodType: SubscriptionPeriodType.TRIAL,
      startedAt,
      currentPeriodEnd,
    };

    const existing = await this.subscriptionRepository.getSubscriptionByUserId({ userId: user.id });
    if (!existing) {
      await this.subscriptionRepository.createSubscription({ subscription: newSubscription });
    } else {
      await this.subscriptionRepository.updateSubscription({
        subscriptionId: existing.subscriptionId,
        subscription: {
          planId: product.planId,
          channel,
          externalId: newSubscription.externalId,
          status: SubscriptionStatus.ACTIVE,
          periodType: SubscriptionPeriodType.TRIAL,
          startedAt,
          currentPeriodEnd,
          cancelledAt: null,
        },
      });
    }

    // Send trial start notification
    try {
      const trialDays = Math.ceil(trialDurationMs / (1000 * 60 * 60 * 24));
      await this.notificationService.sendTrialStartNotification({
        userId: user.id,
        transporterType: NotificationTransporterType.MAIL,
        trialDays,
        correlationId: event.original_transaction_id || event.transaction_id || undefined,
        requestId: `revenuecat-${event.original_transaction_id || event.transaction_id}`,
      });
    } catch (error) {
      this.logger.error('Failed to send trial start notification', {
        userId: user.id,
        error: error as Error,
        correlationId: event.original_transaction_id || event.transaction_id,
      });
      // Don't throw - notification failure shouldn't break the webhook processing
    }
  }
}
