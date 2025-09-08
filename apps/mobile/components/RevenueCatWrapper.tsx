import { authClient } from '@/lib/auth';
import { useRevenueCatStore } from '@/store';
import React, { PropsWithChildren, useEffect } from 'react';
import { BrandedLoader } from './BrandedLoader';

interface RevenueCatWrapperProps extends PropsWithChildren<{}> {}

export const RevenueCatWrapper = ({ children }: RevenueCatWrapperProps) => {
  const { configure, isConfigured, isLoading, reset } = useRevenueCatStore();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Configure RevenueCat when user is authenticated
  useEffect(() => {
    if (session?.user?.id && !isConfigured) {
      configure();
    }
    if (!session?.user?.id && isConfigured) {
      reset();
    }
  }, [session?.user?.id, isConfigured, configure, reset]);

  // Show loading while session is pending or RevenueCat is loading
  if (isSessionPending || isLoading) {
    return <BrandedLoader message="Loading your space..." />;
  }

  return <>{children}</>;
};
