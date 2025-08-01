import { auth } from '@/auth/auth';
import { logger } from '@/utils/logger.instance';
import type { SelectUser } from '@counsy-ai/db/schema';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export type AuthenticatedUser = {
  user: SelectUser;
};

export const authPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorateRequest('user', null as unknown as SelectUser);

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const session = await auth.api.getSession({ headers });
        if (!session?.user) {
          return await reply.status(401).send({ message: 'Unauthorized' });
        }

        request.user = {
          ...session.user,
          image: session.user.image ?? null,
        };
      } catch (error) {
        logger.error('Authentication Error:', { error: JSON.stringify(error) });
        return reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  );
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: SelectUser;
  }
}
