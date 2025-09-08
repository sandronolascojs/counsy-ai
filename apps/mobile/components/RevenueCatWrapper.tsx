import { env } from '@/config/env.config';
import { authClient } from '@/lib/auth';
import { mobileLogger } from '@/utils/logger';
import Constants from 'expo-constants';
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { BrandedLoader } from './BrandedLoader';

interface RevenueCatWrapperProps extends PropsWithChildren<{}> {}

export const RevenueCatWrapper = ({ children }: RevenueCatWrapperProps) => {
  // Only enable RevenueCat in standalone/native builds
  const isExpo = Constants.executionEnvironment === 'storeClient';
  if (isExpo) {
    // In Expo Go or guest, just render children
    return <>{children}</>;
  }

  // Dynamically require Purchases to avoid loading in Expo Go
  const { data: session, isPending } = authClient.useSession();
  const isConfiguredRef = useRef<string | null>(null); // Track configured userId

  // Select API key based on platform
  const apiKey = useMemo(() => {
    return Platform.OS === 'ios'
      ? env.EXPO_PUBLIC_RC_API_KEY_IOS
      : env.EXPO_PUBLIC_RC_API_KEY_ANDROID;
  }, []);

  useEffect(() => {
    const userId = session?.user?.id ?? null;
    if (!userId || isConfiguredRef.current === userId) return;
    try {
      Purchases.configure({ apiKey, appUserID: userId });
      if (env.EXPO_PUBLIC_APP_ENV === 'development') {
        mobileLogger.info('RevenueCat configured', { userId });
      }
      isConfiguredRef.current = userId;
    } catch (err) {
      mobileLogger.error('Failed to configure RevenueCat', { error: err, userId });
    }
  }, [apiKey, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) {
      isConfiguredRef.current = null;
    }
  }, [session?.user?.id]);

  const content = useMemo(() => {
    if (isPending) {
      return <BrandedLoader message="Loading your space..." />;
    }
    return <>{children}</>;
  }, [isPending, children]);

  return content;
};
