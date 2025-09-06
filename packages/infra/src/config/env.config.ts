import { z } from 'zod';

const _envSchema = z
  .object({
    SST_STAGE: z.enum(['development', 'staging', 'production']).default('development'),
    FRONTEND_URL: z.string(),

    // slack
    SLACK_CLIENT_ID: z.string().min(1),
    SLACK_CLIENT_SECRET: z.string().min(1),
    OAUTH_SCOPES: z.string().min(1),

    // auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    // email
    FROM_EMAIL: z.string().min(1),
    AWS_REGION: z.string().min(1),
    SES_CONFIGURATION_SET: z.string().optional(),

    // google credentials
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // cloudflare
    CLOUDFLARE_API_TOKEN: z.string().min(1),
    CLOUDFLARE_DEFAULT_ACCOUNT_ID: z.string().min(1),
  })
  .safeParse(process.env);

if (!_envSchema.success) {
  throw new Error(`Invalid environment variables: ${_envSchema.error.message}`);
}

export const env = _envSchema.data;
