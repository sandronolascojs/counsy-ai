import { logger } from '@/utils/logger.instance';
import { contract } from '@counsy-ai/ts-rest';
import { initServer } from '@ts-rest/fastify';

import { env } from '@/config/env.config';
import { NotificationService } from '@/services/notification.service';
import { RevenueCatWebhookService } from '@/services/revenueCatWebhook.service';
import { db } from '@counsy-ai/db';
import { TypedSnsProducer } from '@counsy-ai/shared';

const server = initServer();

export const publicController = server.router(contract.publicContract, {
  revenueCatWebhook: async ({ body }) => {
    logger.info('revenueCatWebhook', body);
    const snsProducer = new TypedSnsProducer(
      {
        region: env.AWS_REGION,
        topicArn: env.NOTIFICATIONS_TOPIC_ARN,
      },
      logger,
    );
    const notificationService = new NotificationService({
      snsProducer,
      logger,
    });
    const service = new RevenueCatWebhookService({
      notificationService,
      db,
      logger,
    });
    await service.handleEvent(body);

    return {
      status: 200,
      body: undefined,
    };
  },
});
