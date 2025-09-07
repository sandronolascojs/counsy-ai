import { env } from '@/config/env.config';
import { getAppleClientSecret } from '@/utils/apple.secret.manager';
import { SesEmailService } from '@/utils/sesEmail.service';
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

// Align mobile schemes with apps/mobile/config/scheme.shared.js
const schemeForEnv =
  env.APP_ENV === 'production'
    ? 'counsy-ai'
    : env.APP_ENV === 'staging'
      ? 'counsy-ai-staging'
      : 'counsy-ai-dev';
const mobileOrigins = [`${schemeForEnv}://`, `${schemeForEnv}://*`];

const devExpoOrigins = env.APP_ENV === 'production' ? [] : ['exp://192.168.100.30:8081'];

const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '');

const buildTrustedOrigins = (): string[] => {
  const isProduction = process.env.NODE_ENV === 'production' || env.APP_ENV === 'production';

  const frontend = normalizeOrigin(env.FRONTEND_URL);
  const allowedFromEnv = env.ALLOWED_ORIGINS.split(',')
    .map(normalizeOrigin)
    .filter((o) => o.length > 0);

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
  trustedOrigins: buildTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const emailService = new SesEmailService();
      const schemeName =
        env.APP_ENV === 'production'
          ? 'counsy-ai'
          : env.APP_ENV === 'staging'
            ? 'counsy-ai-staging'
            : 'counsy-ai-dev';
      const scheme = `${schemeName}://`;
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
        const emailService = new SesEmailService();
        const schemeName =
          env.APP_ENV === 'production'
            ? 'counsy-ai'
            : env.APP_ENV === 'staging'
              ? 'counsy-ai-staging'
              : 'counsy-ai-dev';
        const scheme = `${schemeName}://`;
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
