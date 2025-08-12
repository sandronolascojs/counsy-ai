import { env } from '@/config/env.config';
import { contract } from '@counsy-ai/ts-rest';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { authClient } from './auth';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: env.EXPO_PUBLIC_API_URL,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  customFetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers ?? {});
    const cookies = authClient.getCookie();
    if (cookies && !headers.has('Cookie')) {
      headers.set('Cookie', cookies);
    }
    return fetch(input, {
      ...init,
      headers,
      credentials: 'include',
    });
  },
  onResponse: async (res: Response) => {
    if (res.status === 401) {
      await authClient.signOut();
    }
    return res;
  },
});
