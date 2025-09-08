import { tsr } from '@/lib/tsrClient';
import { SubscriptionVendor } from '@counsy-ai/types';
import { useMemo } from 'react';
import { Platform } from 'react-native';

function detectChannel(): SubscriptionVendor {
  if (Platform.OS === 'ios') return SubscriptionVendor.APPLE_IAP;
  if (Platform.OS === 'android') return SubscriptionVendor.GOOGLE_PLAY;
  return SubscriptionVendor.STRIPE;
}

export function useProductCatalog() {
  const channel = useMemo(detectChannel, []);

  const { data, isLoading, isError, error } = tsr.billingContract.getCatalog.useQuery({
    queryKey: ['billing', 'catalog', channel],
  });

  return {
    channel,
    catalogData: data?.body,
    isLoading,
    isError,
    error,
  };
}
