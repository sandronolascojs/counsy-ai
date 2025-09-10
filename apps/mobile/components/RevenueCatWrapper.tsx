import { authClient } from '@/lib/auth';
import { useRevenueCatStore } from '@/store';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { BrandedLoader } from './BrandedLoader';

interface RevenueCatWrapperProps extends PropsWithChildren<{}> {}

export const RevenueCatWrapper = ({ children }: RevenueCatWrapperProps) => {
  const { configure, isConfigured, isLoading, reset } = useRevenueCatStore();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Refs to prevent double-initialization
  const initializedRef = useRef(false);
  const inFlightRef = useRef(false);

  // Configure RevenueCat when user is authenticated
  useEffect(() => {
    // Don't run if session is still loading/pending
    if (isSessionPending) {
      return;
    }

    // Configure when user exists, not already configured, and not in-flight
    if (session?.user?.id && !isConfigured && !inFlightRef.current) {
      inFlightRef.current = true;
      initializedRef.current = true;

      configure().finally(() => {
        inFlightRef.current = false;
      });
    }

    // Reset when no user, configured, and not in-flight
    if (!session?.user?.id && isConfigured && !inFlightRef.current) {
      inFlightRef.current = true;
      initializedRef.current = false;

      reset();
      inFlightRef.current = false;
    }
  }, [session?.user?.id, isConfigured, isSessionPending, configure, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      inFlightRef.current = false;
    };
  }, []);

  // Show loading while session is pending or RevenueCat is loading
  if (isSessionPending || isLoading) {
    return <BrandedLoader message="Loading your space..." />;
  }

  return <>{children}</>;
};
