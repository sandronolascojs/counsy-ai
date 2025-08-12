import { env } from '@/config/env.config';
import { contract } from '@counsy-ai/ts-rest';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { authClient } from './auth';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: env.EXPO_API_URL,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});
