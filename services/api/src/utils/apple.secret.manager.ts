import { env } from '@/config/env.config';
import { assertValidPkcs8 } from '@/utils/pem';
import { SignJWT, importPKCS8 } from 'jose';

const TTL_SEC = 60 * 60 * 12; // 12 h
const RENEW_MARGIN_SEC = 60 * 30; // renew if less than 30 min

let cached: { value: string; exp: number } | null = null;
let cachedPromise: Promise<{ value: string; exp: number }> | null = null;

export function loadAppleP8(): string {
  const key = env.APPLE_PRIVATE_KEY;

  return assertValidPkcs8(key);
}

async function buildAppleClientSecret(): Promise<{ value: string; exp: number }> {
  const alg = 'ES256';
  const pk = await importPKCS8(loadAppleP8(), alg);
  const now = Math.floor(Date.now() / 1000);
  const exp = now + TTL_SEC;

  const value = await new SignJWT({})
    .setProtectedHeader({ alg, kid: env.APPLE_KEY_ID })
    .setIssuer(env.APPLE_TEAM_ID)
    .setSubject(env.APPLE_CLIENT_ID)
    .setAudience('https://appleid.apple.com')
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(pk);

  return { value, exp };
}

export async function getAppleClientSecret(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const needsRefresh = !cached || cached.exp - now < RENEW_MARGIN_SEC;

  if (needsRefresh) {
    if (!cachedPromise) {
      cachedPromise = buildAppleClientSecret();
    }
    try {
      const result = await cachedPromise;
      cached = result;
      return result.value;
    } finally {
      // Clear promise regardless of success/failure to allow retries
      cachedPromise = null;
    }
  }

  if (!cached) {
    // Fallback: build if cache unexpectedly missing
    if (!cachedPromise) {
      cachedPromise = buildAppleClientSecret();
    }
    try {
      const result = await cachedPromise;
      cached = result;
      return result.value;
    } finally {
      cachedPromise = null;
    }
  }
  return cached.value;
}
