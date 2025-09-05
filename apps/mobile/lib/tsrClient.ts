import { env } from '@/config/env.config';
import { contract } from '@counsy-ai/ts-rest';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { authClient } from './auth';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: env.EXPO_PUBLIC_API_URL,
  baseHeaders: {
    Accept: 'application/json',
  },
  credentials: 'include',
  customFetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers ?? {});
    const method = (init?.method ?? 'GET').toUpperCase();
    const hasBody = typeof init?.body !== 'undefined' && init?.body !== null;
    const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

    // Conditionally set Content-Type only for requests with JSON bodies
    if (
      hasBody &&
      !isFormData &&
      !headers.has('Content-Type') &&
      (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
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
