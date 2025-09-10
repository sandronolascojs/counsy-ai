import { tsr } from '@/lib/tsrClient';
import type { contract } from '@counsy-ai/ts-rest';
import { SubscriptionVendor } from '@counsy-ai/types';
import { ClientInferResponseBody } from '@ts-rest/core';
import { useMemo } from 'react';
import { Platform } from 'react-native';

export type ProductCatalog = ClientInferResponseBody<
  typeof contract.billingContract.getCatalog,
  200
>;

function detectChannel(): SubscriptionVendor {
  if (Platform.OS === 'ios') return SubscriptionVendor.APPLE_IAP;
  if (Platform.OS === 'android') return SubscriptionVendor.GOOGLE_PLAY;
  return SubscriptionVendor.STRIPE;
}

export function useProductCatalog() {
  const channel = useMemo(detectChannel, []);

  const { data, isLoading, isError, error } = tsr.billingContract.getCatalog.useQuery({
    queryKey: ['billing', 'catalog', channel],
    queryData: {
      query: {
        channel,
      },
    },
  });

  return {
    channel,
    catalogData: data?.body,
    isLoading,
    isError,
    error,
  };
}
