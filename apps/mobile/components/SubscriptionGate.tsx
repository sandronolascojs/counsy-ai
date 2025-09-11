import { BrandedLoader } from '@/components/BrandedLoader';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { PropsWithChildren } from 'react';
import { ProfessionalPaywall } from './ProfessionalPaywall';

export const SubscriptionGate = ({ children }: PropsWithChildren) => {
  const { loading, hasActiveSubscription, purchasePackage } = useRevenueCat();

  if (loading) {
    return <BrandedLoader message="Loading your space..." />;
  }

  if (!hasActiveSubscription()) {
    return <ProfessionalPaywall onClose={() => {}} onPurchase={purchasePackage} />;
  }

  return <>{children}</>;
};
