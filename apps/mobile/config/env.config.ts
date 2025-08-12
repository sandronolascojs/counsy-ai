import { z } from 'zod';

export const envSchema = z
  .object({
    EXPO_APP_ENV: z
      .enum(['development', 'staging', 'production', 'preview'])
      .default('development'),
    EXPO_API_URL: z.string(),
    EAS_BUILD_PROFILE: z.string(),
  })
  .safeParse(process.env);

if (!envSchema.success) {
  throw new Error('Invalid environment variables', envSchema.error);
}

export const env = envSchema.data;
