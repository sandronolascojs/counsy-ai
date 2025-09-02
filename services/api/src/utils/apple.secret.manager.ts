import { env } from '@/config/env.config';
import { SignJWT, importPKCS8 } from 'jose';

const TTL_SEC = 60 * 60 * 12; // 12 h
const RENEW_MARGIN_SEC = 60 * 30; // renew if less than 30 min

let cached: { value: string; exp: number } | null = null;

export function loadAppleP8(): string {
  let key = env.APPLE_PRIVATE_KEY;

  key = key.replace(/\\n/g, '\n').replace(/\r/g, '');

  key = key.trim().replace(/^\uFEFF/, '');

  if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1).trim();
  if (key.startsWith("'") && key.endsWith("'")) key = key.slice(1, -1).trim();

  if (!key.startsWith('-----BEGIN PRIVATE KEY-----') || !key.includes('-----END PRIVATE KEY-----'))
    throw new Error('APPLE_PRIVATE_KEY invalid: missing headers/footers PKCS#8');

  return key;
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
  if (!cached || cached.exp - now < RENEW_MARGIN_SEC) {
    cached = await buildAppleClientSecret();
  }
  return cached.value;
}
