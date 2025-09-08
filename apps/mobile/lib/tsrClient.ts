import { env } from '@/config/env.config';
import { contract } from '@counsy-ai/ts-rest';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { authClient } from './auth';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: env.EXPO_PUBLIC_API_URL,
  baseHeaders: {
    Accept: 'application/json',
    Cookie: authClient.getCookie(),
  },
  credentials: 'include',
  onResponse: async (res: Response) => {
    if (res.status === 401) {
      await authClient.signOut();
    }
    return res;
  },
});
