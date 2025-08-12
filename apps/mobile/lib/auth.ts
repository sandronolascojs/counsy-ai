import { env } from '@/config/env.config';
import { expoClient } from '@better-auth/expo/client';
import { APP_CONFIG } from '@counsy-ai/types';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: env.EXPO_API_URL,
  plugins: [
    expoClient({
      scheme:
        env.EXPO_APP_ENV === 'production'
          ? APP_CONFIG.basics.prefix
          : `${APP_CONFIG.basics.prefix}-${env.EXPO_APP_ENV}`,
      storagePrefix: APP_CONFIG.basics.prefix,
      storage: SecureStore,
    }),
  ],
});
