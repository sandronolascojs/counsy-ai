import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'EXPO_PUBLIC_',
  server: {
    EAS_BUILD_PROFILE: z.string(),
  },
  client: {
    EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    EXPO_PUBLIC_API_URL: z.string(),
    EXPO_PUBLIC_RC_API_KEY_IOS: z.string(),
    EXPO_PUBLIC_RC_API_KEY_ANDROID: z.string(),
  },
  runtimeEnv: process.env,
});
