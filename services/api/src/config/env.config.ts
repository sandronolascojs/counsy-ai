import { normalizePem } from '@/utils/pem';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production', 'staging']).default('development'),
    DATABASE_URL: z.string(),
    ALLOWED_ORIGINS: z.string().default('*'),
    APP_DEV_EXPO_ORIGINS: z.string().optional(),
    API_BASE_URL: z.string(),
    FRONTEND_URL: z.string(),

    // auth
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),

    // email
    FROM_EMAIL: z.string(),
    AWS_REGION: z.string(),
    SES_CONFIGURATION_SET: z.string().optional(),
    NOTIFICATIONS_TOPIC_ARN: z.string(),

    // google
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    // apple
    APPLE_CLIENT_ID: z.string(),
    APPLE_PRIVATE_KEY: z.preprocess(
      (val) => (typeof val === 'string' ? normalizePem(val) : val),
      z.string(),
    ),
    APPLE_KEY_ID: z.string(),
    APPLE_TEAM_ID: z.string(),
    APPLE_BUNDLE_IDENTIFIER: z.string(),
  },
  runtimeEnvStrict: {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    APP_DEV_EXPO_ORIGINS: process.env.APP_DEV_EXPO_ORIGINS,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    FROM_EMAIL: process.env.FROM_EMAIL,
    AWS_REGION: process.env.AWS_REGION,
    SES_CONFIGURATION_SET: process.env.SES_CONFIGURATION_SET,
    NOTIFICATIONS_TOPIC_ARN: process.env.NOTIFICATIONS_TOPIC_ARN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    APPLE_BUNDLE_IDENTIFIER: process.env.APPLE_BUNDLE_IDENTIFIER,
  },
});
