import { env } from '@/config/env.config';
import { getAppleClientSecret } from '@/utils/apple.secret.manager';
import { expo } from '@better-auth/expo';
import { db } from '@counsy-ai/db';
import * as schema from '@counsy-ai/db/schema';
import { APP_CONFIG } from '@counsy-ai/types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { haveIBeenPwned, HaveIBeenPwnedOptions, magicLink } from 'better-auth/plugins';

const APPLE_CLIENT_SECRET = await getAppleClientSecret();

const haveIBeenPwnedPlugin: HaveIBeenPwnedOptions = {
  customPasswordCompromisedMessage:
    'This password has been compromised in a data breach. Please choose a different password.',
};

const cacheTTL = 5 * 60 * 1000; // 5 minutes
const TTL = 60 * 60 * 1000; // 1 hour

const mobileOrigins = [
  env.APP_ENV === 'production'
    ? `${APP_CONFIG.basics.prefix}://`
    : `${APP_CONFIG.basics.prefix}-${env.APP_ENV}://`,
  env.APP_ENV === 'production'
    ? `${APP_CONFIG.basics.prefix}://*`
    : `${APP_CONFIG.basics.prefix}-${env.APP_ENV}://*`,
];

const devExpoOrigins = env.APP_ENV === 'production' ? [] : ['exp://192.168.100.30:8081'];

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: cacheTTL,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  rateLimit: {
    enabled: true,
    max: 100,
    window: TTL,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  trustedOrigins: [
    ...mobileOrigins,
    ...devExpoOrigins,
    ...env.ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  ],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async () => {
      /* const { email } = user;
      const resetPasswordUrl = `${url}?token=${token}`;
      await emailService.sendEmail({
        to: email,
        subject: `${APP_CONFIG.basics.name} - Reset your password`,
        html: `Click <a href="${resetPasswordUrl}">here</a> to reset your password`,
      }); */
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      enabled: true,
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: APPLE_CLIENT_SECRET,
      appBundleIdentifier: env.APPLE_BUNDLE_IDENTIFIER,
    },
  },
  plugins: [
    expo(),
    haveIBeenPwned(haveIBeenPwnedPlugin),
    magicLink({
      sendMagicLink: async () => {
        /* const magicLinkUrl = `${url}?token=${token}`;
        await emailService.sendEmail({
          to: email,
          subject: `${APP_CONFIG.basics.name} - Magic link`,
          html: `Click <a href="${magicLinkUrl}">here</a> to login`,
        }); */
      },
      disableSignUp: true,
    }),
  ],
});
