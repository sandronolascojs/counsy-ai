import { PRODUCT_IDS_FALLBACK, toCycleKey } from '@/constants/revenueCat';
import { useRevenueCatStore } from '@/store';
import { BillingCycle, SubscriptionTier } from '@counsy-ai/types';
import { useMemo } from 'react';
import { useProductCatalog } from './http/catalog/useProductCatalog';

export function useRevenueCat() {
  // Get base RevenueCat functionality from Zustand store
  const revenueCatStore = useRevenueCatStore();

  // Get catalog data for enhanced package finding
  const { catalogData, isLoading: catLoading } = useProductCatalog();

  // Build an index: (tier, cycle) -> externalProductId
  const productIdFromCatalog = useMemo(() => {
    const dict = new Map<string, string>();
    catalogData?.forEach((row) => {
      row.products.forEach((p) => {
        dict.set(`${row.name}:${toCycleKey(p.billingCycle)}`, p.externalProductId);
      });
    });
    return (plan: SubscriptionTier, cycle: BillingCycle) =>
      dict.get(`${plan}:${toCycleKey(cycle)}`) ?? null;
  }, [catalogData]);

  // Enhanced findPackage that uses catalog data
  const findPackage = (plan: SubscriptionTier, cycle: BillingCycle) => {
    // 1) Try backend catalog first
    const pid = productIdFromCatalog(plan, cycle);
    if (pid) {
      const pkgFromCatalog = revenueCatStore.findPackageByProductId(pid);
      if (pkgFromCatalog) return pkgFromCatalog;
    }

    // 2) Fallback to local IDs
    const key = toCycleKey(cycle);
    const fallbackId = PRODUCT_IDS_FALLBACK[plan]?.[key];
    if (fallbackId) {
      return revenueCatStore.findPackageByProductId(fallbackId);
    }

    return undefined;
  };

  return {
    ...revenueCatStore,
    loading: revenueCatStore.isLoading || catLoading,
    findPackage,
  };
}
