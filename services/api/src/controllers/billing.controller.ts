import { CatalogService } from '@/services/catalog.service';
import { logger } from '@/utils/logger.instance';
import { db } from '@counsy-ai/db';
import { contract } from '@counsy-ai/ts-rest';
import { initServer } from '@ts-rest/fastify';

const server = initServer();

export const billingController = server.router(contract.billingContract, {
  getCatalog: async ({ query }) => {
    const catalogService = new CatalogService(db, logger);
    const catalog = await catalogService.getCatalog({ query });
    return {
      status: 200,
      body: catalog,
    };
  },
});
