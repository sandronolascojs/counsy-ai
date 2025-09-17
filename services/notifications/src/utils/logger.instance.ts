import { env } from '@/config/env.config';
import { Logger } from '@counsy-ai/shared';

export const logger = new Logger({
  serviceName: 'notifications',
  isProd: env.APP_ENV === 'production',
  level: env.APP_ENV === 'production' ? 'info' : 'debug',
});
