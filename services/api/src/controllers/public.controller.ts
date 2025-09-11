import { logger } from '@/utils/logger.instance';
import { contract } from '@counsy-ai/ts-rest';
import { initServer } from '@ts-rest/fastify';

import { RevenueCatWebhookService } from '@/services/revenueCatWebhook.service';
import { db } from '@counsy-ai/db';

const server = initServer();

export const publicController = server.router(contract.publicContract, {
  revenueCatWebhook: async ({ body }) => {
    logger.info('revenueCatWebhook', body);
    const service = new RevenueCatWebhookService(db, logger);
    await service.handleEvent(body);

    return {
      status: 200,
      body: undefined,
    };
  },
});
