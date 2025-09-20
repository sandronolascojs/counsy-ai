import { awsLambdaFastify } from '@fastify/aws-lambda';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastify from 'fastify';

import { initServer } from '@ts-rest/fastify';
import { corsConfig } from './config/cors.config';
import { env } from './config/env.config';
import { rateLimitConfig } from './config/rateLimit.config';
import { registerAuthController } from './controllers/auth.controller';
import { billingController } from './controllers/billing.controller';
import { publicController } from './controllers/public.controller';
import { authPlugin } from './plugins/auth.plugin';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin';
import { requestHandlerPlugin } from './plugins/requestHandler.plugin';
import { logger } from './utils/logger.instance';

export function buildServer() {
  const app = fastify({ logger: true });
  const tsRest = initServer();

  app.register(cors, corsConfig);
  app.register(rateLimit, rateLimitConfig);

  app.register(requestHandlerPlugin);
  app.register(errorHandlerPlugin);

  app.register(registerAuthController);

  app.register(tsRest.plugin(publicController));

  app.register(async (fastify) => {
    await fastify.register(authPlugin);

    fastify.register(tsRest.plugin(billingController), {
      hooks: { preHandler: fastify.authenticate },
    });
    /* fastify.register(tsRest.plugin(workspaceController), {
      hooks: { preHandler: fastify.authenticate },
    }); */
  });

  return app;
}

const proxy = awsLambdaFastify(buildServer());
export const handler = proxy;

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  buildServer()
    .listen({ port: env.PORT, host: 'localhost' })
    .then(() => {
      logger.info(`🚀 API ready at http://localhost:${env.PORT}`);
    })
    .catch((err: unknown) => {
      logger.error('Failed to start API', {
        error: err instanceof Error ? err.message : 'Unknown error',
      });
      process.exit(1);
    });
}
