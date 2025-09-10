/**
 * Authentication configuration with security improvements:
 * - Replaced broad wildcard 'exp://*' with explicit whitelist from APP_DEV_EXPO_ORIGINS
 * - Added proper origin validation to prevent security vulnerabilities
 * - Defaults to empty array when no whitelist is provided for maximum security
 */
import { env } from '@/config/env.config';
import { SubscriptionRepository } from '@/repositories/subscription.repository';
import { UserRepository } from '@/repositories/user.repository';
import { emailServiceSingleton } from '@/services/sesEmail.service';
import { SubscriptionsService } from '@/services/subscription.service';
import { getAppleClientSecret } from '@/utils/apple.secret.manager';
import { logger } from '@/utils/logger.instance';
import { expo } from '@better-auth/expo';
import { db } from '@counsy-ai/db';
import type { SelectSubscription } from '@counsy-ai/db/schema';
import * as schema from '@counsy-ai/db/schema';
import { APP_CONFIG } from '@counsy-ai/types';
import type { Session, User } from 'better-auth';
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

const mobileOrigins = [`${APP_CONFIG.basics.prefix}://`];

const getDevExpoOrigins = (): string[] => {
  // In production, never allow any Expo origins for security
  if (env.APP_ENV === 'production') {
    return [];
  }

  // If no whitelist is provided, default to empty array for security
  // This prevents the previous security risk of allowing any Expo dev client
  if (!env.APP_DEV_EXPO_ORIGINS) {
    return [];
  }

  // Parse comma-separated list of allowed Expo origins
  return env.APP_DEV_EXPO_ORIGINS.split(',')
    .map(normalizeOrigin)
    .filter((origin) => {
      // Only allow exp:// origins in development with proper validation
      return (
        origin.startsWith('exp://') &&
        origin.length > 6 &&
        !origin.includes('*') && // No wildcards allowed
        origin.match(/^exp:\/\/[a-zA-Z0-9.-]+$/) // Basic format validation
      );
    });
};

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '');

const buildTrustedOrigins = (): string[] => {
  const isProduction = process.env.NODE_ENV === 'production' || env.APP_ENV === 'production';

  const frontend = normalizeOrigin(env.FRONTEND_URL);
  const allowedFromEnv = env.ALLOWED_ORIGINS.split(',')
    .map(normalizeOrigin)
    .filter((o) => o.length > 0);

  const devExpoOrigins = getDevExpoOrigins();
  const combined = [...mobileOrigins, ...devExpoOrigins, ...allowedFromEnv, frontend].map(
    normalizeOrigin,
  );

  const filtered = combined.filter((origin) => {
    if (!origin) return false;
    if (isProduction) {
      if (origin === '*' || origin.includes('*')) return false;
      if (origin.startsWith('exp://')) return false;
    }
    return true;
  });

  return Array.from(new Set(filtered));
};

const userRepository = new UserRepository(db, logger);
const subscriptionRepository = new SubscriptionRepository(db, logger);
const subscriptionsService = new SubscriptionsService(
  userRepository,
  subscriptionRepository,
  logger,
  db,
);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: cacheTTL,
    },
  },
  callbacks: {
    async session({ session, user }: { session?: Session; user?: User }) {
      let subscription: SelectSubscription | undefined = undefined;
      if (user?.id) {
        try {
          subscription = await subscriptionsService.getSubscriptionByUserId({ userId: user.id });
        } catch (error) {
          logger.error('Failed to fetch subscription for user', {
            userId: user.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          subscription = undefined;
        }
      }
      return {
        ...session,
        user: {
          ...user,
          subscription,
        },
      };
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
  trustedOrigins: buildTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const emailService = emailServiceSingleton;
      const scheme = `${APP_CONFIG.basics.prefix}://`;
      const callbackDeepLink = `${scheme}reset?token=${encodeURIComponent(token)}`;
      const resetUrl = new URL(url);
      resetUrl.searchParams.set('callbackURL', callbackDeepLink);
      const resetPasswordUrl = resetUrl.toString();
      await emailService.sendEmail({
        to: user.email,
        subject: `${APP_CONFIG.basics.name} - Reset your password`,
        html: `Click <a href="${resetPasswordUrl}">here</a> to reset your password`,
        text: `Open the following link to reset your password: ${resetPasswordUrl}`,
      });
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
      sendMagicLink: async ({ email, url, token }) => {
        const emailService = emailServiceSingleton;
        const scheme = `${APP_CONFIG.basics.prefix}://`;
        const callbackDeepLink = `${scheme}auth/magic-link?token=${encodeURIComponent(token)}`;
        const magicUrl = new URL(url);
        magicUrl.searchParams.set('callbackURL', callbackDeepLink);
        const magicLinkUrl = magicUrl.toString();
        await emailService.sendEmail({
          to: email,
          subject: `${APP_CONFIG.basics.name} - Magic link`,
          html: `Click <a href="${magicLinkUrl}">here</a> to login`,
          text: `Open the following link to login: ${magicLinkUrl}`,
        });
      },
      disableSignUp: true,
    }),
  ],
});
