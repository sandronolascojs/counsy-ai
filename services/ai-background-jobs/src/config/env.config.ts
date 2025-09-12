import { z } from 'zod';

const envSchema = z
  .object({
    // AI
    OPENAI_API_KEY: z.string(),

    // Server
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production', 'dev', 'staging']).default('dev'),

    // Redis
    REDIS_URL: z.string(),

    // supabase
    SUPABASE_URL: z.string(),
    SUPABASE_KEY: z.string(),
    SUPABASE_BUCKET_IMAGES_URL: z.string(),
  })
  .safeParse(process.env);

if (!envSchema.success) {
  throw new Error(`Invalid environment variables: ${envSchema.error.message}`);
}

export const env = envSchema.data;
