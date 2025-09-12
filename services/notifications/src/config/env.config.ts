import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production', 'staging']).default('development'),
    DATABASE_URL: z.string(),

    // email
    FROM_EMAIL: z.string(),
    AWS_REGION: z.string(),
    SES_CONFIGURATION_SET: z.string().optional(),
  },
  runtimeEnvStrict: {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    FROM_EMAIL: process.env.FROM_EMAIL,
    AWS_REGION: process.env.AWS_REGION,
    SES_CONFIGURATION_SET: process.env.SES_CONFIGURATION_SET,
  },
});
