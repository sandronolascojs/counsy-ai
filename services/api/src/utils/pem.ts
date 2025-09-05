/**
 * Utilities to normalize and validate PEM (PKCS#8) private keys.
 */

export const normalizePem = (val: string): string => {
  let input = typeof val === 'string' ? val : String(val);
  input = input.trim();

  // Decode base64 blob when it lacks PEM headers but looks like base64
  const hasPemHeader = /-----BEGIN [A-Z ]+-----/.test(input);
  const looksBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(input) && !hasPemHeader;
  if (looksBase64) {
    try {
      input = Buffer.from(input, 'base64').toString('utf8').trim();
    } catch {
      // ignore and use raw input
    }
  }

  // Convert escaped newlines and strip CR
  input = input.replace(/\\n/g, '\n').replace(/\r/g, '');

  // Remove BOM and surrounding quotes
  input = input.trim().replace(/^\uFEFF/, '');
  if (input.startsWith('"') && input.endsWith('"')) input = input.slice(1, -1).trim();
  if (input.startsWith("'") && input.endsWith("'")) input = input.slice(1, -1).trim();

  return input.trim();
};

export const isValidPkcs8 = (pem: string): boolean => {
  const pkcs8Pattern =
    /^-----BEGIN PRIVATE KEY-----\n(?:[A-Za-z0-9+/=]+\n)+-----END PRIVATE KEY-----\n?$/;
  return pkcs8Pattern.test(pem.trim());
};

export const assertValidPkcs8 = (pem: string): string => {
  const normalized = normalizePem(pem);
  if (!isValidPkcs8(normalized)) {
    throw new Error('APPLE_PRIVATE_KEY invalid: missing headers/footers PKCS#8');
  }
  return normalized;
};
