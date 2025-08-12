import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',
  server: {
    EAS_BUILD_PROFILE: z.string(),
  },
  client: {
    EXPO_PUBLIC_APP_ENV: z
      .enum(['development', 'staging', 'production', 'preview'])
      .default('development'),
    EXPO_PUBLIC_API_URL: z.string(),
  },
  runtimeEnv: process.env,
});
