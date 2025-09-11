import { useProductCatalog } from '@/hooks/http/catalog/useProductCatalog';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { mobileLogger } from '@/utils/logger';
import { BillingCycle, Currency, SubscriptionTier } from '@counsy-ai/types';
import { LinearGradient } from '@tamagui/linear-gradient';
import {
  Award,
  Brain,
  Check,
  Crown,
  Heart,
  Lock,
  Shield,
  Star,
  Target,
  X,
  Zap,
} from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Image } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { Button, Paragraph, ScrollView, Switch, Text, XStack, YStack } from 'tamagui';
import { useToast } from './ui/Toast';

const Section = ({ children }: { children: React.ReactNode }) => (
  <YStack px="$5" py="$4" gap="$3">
    {children}
  </YStack>
);

const PriceCard = ({
  title,
  rightPrice,
  leftSub,
  rightSub,
  selected,
  onPress,
  showBadge,
}: {
  title: string;
  rightPrice: string;
  leftSub?: string;
  rightSub?: string;
  selected?: boolean;
  onPress?: () => void;
  showBadge?: boolean;
}) => (
  <Button
    onPress={onPress}
    chromeless
    height="auto"
    p="$4"
    mt="$2"
    bg={selected ? '$accent2' : '$background'}
    borderWidth={selected ? 2 : 1}
    borderColor={selected ? '$accent9' : '$borderColor'}
    rounded="$4"
    pressStyle={{ scale: 0.98 }}
    position="relative"
  >
    {showBadge && (
      <YStack position="absolute" t={-10} r={-10} bg="$accent9" px="$2" py="$1" rounded="$2">
        <Text fontSize="$2" fontWeight="700" color="white">
          MOST POPULAR
        </Text>
      </YStack>
    )}
    <XStack items="center" content="space-between" gap="$3">
      <XStack items="center" gap="$3">
        <YStack
          width={22}
          height={22}
          borderRightWidth={11}
          borderWidth={2}
          borderColor={selected ? '$accent9' : '$borderColor'}
          items="center"
          content="center"
        >
          {selected ? <YStack width={10} height={10} rounded="$10" bg="$accent9" /> : null}
        </YStack>
        <YStack>
          <Text fontSize="$4" fontWeight="700" color="$color">
            {title}
          </Text>
          {!!leftSub && (
            <Text fontSize="$2" color="$color10">
              {leftSub}
            </Text>
          )}
        </YStack>
      </XStack>
      <YStack items="flex-end">
        <Text fontSize="$6" fontWeight="900" color="$color">
          {rightPrice}
        </Text>
        {!!rightSub && (
          <Text fontSize="$2" color="$color10">
            {rightSub}
          </Text>
        )}
      </YStack>
    </XStack>
  </Button>
);

interface Props {
  onClose: () => void;
  onPurchase: (pkg: PurchasesPackage) => void;
}

export const ProfessionalPaywall = ({ onClose, onPurchase }: Props) => {
  const toast = useToast();
  const { catalogData, isLoading, isError } = useProductCatalog();
  const { refresh, findPackage } = useRevenueCat();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.STANDARD);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(BillingCycle.ANNUAL);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Process catalog data to get plans
  const plans = useMemo(() => {
    if (!catalogData) return [];

    const standardPlan = catalogData.find((plan) => plan.name === SubscriptionTier.STANDARD);
    const maxPlan = catalogData.find((plan) => plan.name === SubscriptionTier.MAX);

    return [standardPlan, maxPlan].filter(Boolean);
  }, [catalogData]);

  // Get current plan data
  const currentPlan = plans.find((plan) => plan?.name === selectedTier);
  const currentProduct = currentPlan?.products.find((p) => p.billingCycle === selectedCycle);

  // Get RevenueCat package for current selection
  const revenueCatPackage = findPackage(selectedTier, selectedCycle);

  // Calculate prices
  const formatPrice = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const monthlyProductForTier = useMemo(() => {
    return currentPlan?.products.find((p) => p.billingCycle === BillingCycle.MONTHLY);
  }, [currentPlan]);

  const annualProductForTier = useMemo(() => {
    return currentPlan?.products.find((p) => p.billingCycle === BillingCycle.ANNUAL);
  }, [currentPlan]);

  const monthlyEquivalentOfAnnual = useMemo(() => {
    if (!annualProductForTier) return null;
    // convert total annual price to per-month
    return Math.round(annualProductForTier.unitAmount / 12);
  }, [annualProductForTier]);

  const annualSavingsPercent = useMemo(() => {
    if (!monthlyProductForTier || !annualProductForTier) return null;
    const monthlyTotalForYear = monthlyProductForTier.unitAmount * 12;
    const saved = monthlyTotalForYear - annualProductForTier.unitAmount;
    if (saved <= 0) return 0;
    return Math.round((saved / monthlyTotalForYear) * 100);
  }, [monthlyProductForTier, annualProductForTier]);

  const dailyPriceNumber = useMemo(() => {
    if (!currentProduct) return null;
    const days =
      selectedCycle === BillingCycle.ANNUAL ? 365 : selectedCycle === BillingCycle.MONTHLY ? 30 : 7;
    return currentProduct.unitAmount / days / 100; // as plain number in currency units
  }, [currentProduct, selectedCycle]);

  const handlePurchase = async () => {
    if (!revenueCatPackage) {
      toast.error('Product not available. Please try again.');
      return;
    }

    setIsPurchasing(true);
    try {
      console.log('purchase successful', revenueCatPackage.product.identifier, selectedCycle);
      onPurchase(revenueCatPackage);
    } catch (error) {
      mobileLogger.error('Error processing purchase', { error });
      toast.error('Error processing purchase. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await refresh();
      toast.success('Purchases restored successfully!');
    } catch (error) {
      mobileLogger.error('Error restoring purchases', { error });
      toast.error('No purchases found to restore.');
    }
  };

  // Get features from current plan
  const currentPlanFeatures = currentPlan?.features || [];

  // Helper function to map features to icons
  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('voice') || featureLower.includes('chat')) return Brain;
    if (featureLower.includes('streak') || featureLower.includes('xp')) return Award;
    if (featureLower.includes('goal') || featureLower.includes('tracking')) return Target;
    if (featureLower.includes('journal') || featureLower.includes('gratitude')) return Heart;
    if (featureLower.includes('quality') || featureLower.includes('voice')) return Zap;
    if (featureLower.includes('mood') || featureLower.includes('insight')) return Shield;
    return Check; // Default icon
  };

  if (isLoading) {
    return (
      <YStack flex={1} bg="$background">
        <YStack
          position="absolute"
          t={0}
          l={0}
          r={0}
          b={0}
          bg="rgba(0,0,0,0.5)"
          items="center"
          content="center"
          z={100}
        >
          <Text color="white" fontSize="$4" fontWeight="600" mt="$3">
            Loading subscription options...
          </Text>
        </YStack>
      </YStack>
    );
  }

  if (isError || !plans.length) {
    return (
      <YStack flex={1} content="center" items="center" p="$5">
        <Text fontSize="$5" color="$color" text="center">
          Unable to load subscription options. Please try again.
        </Text>
        <Button onPress={onClose} mt="$5" p="$3" bg="$accent9" rounded="$2">
          <Text color="white" fontWeight="600">
            Close
          </Text>
        </Button>
      </YStack>
    );
  }

  // Check if we have RevenueCat packages available
  const hasRevenueCatPackages = plans.some((plan) => {
    if (!plan) return false;
    return plan.products.some((product) => {
      const pkg = findPackage(plan.name as SubscriptionTier, product.billingCycle);
      return pkg !== null;
    });
  });

  if (!hasRevenueCatPackages) {
    return (
      <YStack flex={1} content="center" items="center" p="$5">
        <Text fontSize="$5" color="$color" text="center">
          Subscription products are not yet available. Please try again later.
        </Text>
        <Button onPress={onClose} mt="$5" p="$3" bg="$accent9" rounded="$2">
          <Text color="white" fontWeight="600">
            Close
          </Text>
        </Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background">
      {/* Header Image */}
      <YStack height={150} position="relative" overflow="hidden">
        <Button
          position="absolute"
          t="$3"
          l="$3"
          size="$3"
          circular
          bg="rgba(0,0,0,0.35)"
          onPress={onClose}
        >
          <X size={16} color="white" />
        </Button>
        <Image
          source={require('@/assets/images/paywall.png')}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {/* Gradient overlay */}
        <LinearGradient
          start={[0, 0]}
          end={[0, 1]}
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100 }}
        />
        <YStack position="absolute" b="$5" l="$5" r="$5" items="center">
          <Crown size={32} color="white" />
          <Text color="white" fontSize="$6" fontWeight="800" mt="$2" text="center">
            Unlock Your Mental Wellness Journey
          </Text>
        </YStack>
      </YStack>

      {/* Social proof / trust row */}
      <XStack px="$5" pt="$2" pb="$1" items="center" content="space-between">
        <XStack items="center" gap="$2">
          <Star size={14} />
          <Text fontSize="$2" color="$color10">
            Loved by busy people
          </Text>
        </XStack>
        <XStack items="center" gap="$2">
          <Lock size={14} />
          <Text fontSize="$2" color="$color10">
            Encrypted • Cancel anytime
          </Text>
        </XStack>
      </XStack>

      <ScrollView flex={1} background="$backgroundSecondary" showsVerticalScrollIndicator={false}>
        <Section>
          <Text text="center" mt="$4" mb="$2" fontSize="$7" fontWeight="800" color="$color">
            Get a Private AI Counselor
          </Text>
          <Paragraph text="center" mb="$4" fontSize="$3" color="$color10" lineHeight={20}>
            Talk for {currentPlan?.minutesIncluded ?? 60} min/month. Build streaks, track goals, and
            get weekly insights — all end‑to‑end encrypted.
          </Paragraph>

          <YStack height={120} mb="$4">
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <YStack gap="$2">
                {currentPlanFeatures.map((feature, index) => {
                  const IconComponent = getFeatureIcon(feature);
                  return (
                    <XStack key={index} items="center" gap="$2" py="$1">
                      <YStack width={20} height={20} items="center" content="center">
                        <IconComponent size={14} color="$accent9" />
                      </YStack>
                      <Text flex={1} fontSize="$3" color="$color" lineHeight={16} fontWeight="500">
                        {feature}
                      </Text>
                    </XStack>
                  );
                })}
              </YStack>
            </ScrollView>
          </YStack>

          {/* Value bar */}
          {currentProduct && (
            <YStack
              bg="$accent2"
              borderRightWidth="$3"
              p="$4"
              mb="$4"
              borderWidth={1}
              borderColor="$accent6"
              items="center"
            >
              <Text text="center" fontWeight="700" color="$accent11">
                {dailyPriceNumber
                  ? `Just ${currentProduct ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currentProduct.currency }).format(dailyPriceNumber) : ''}/day`
                  : ''}
              </Text>
              {annualSavingsPercent && selectedCycle === BillingCycle.ANNUAL && (
                <Text text="center" fontSize="$2" color="$accent11">
                  Save {annualSavingsPercent}% vs monthly
                </Text>
              )}
            </YStack>
          )}

          {/* Plan Toggle */}
          <YStack
            bg="$background"
            rounded="$3"
            p="$4"
            mb="$4"
            borderWidth={1}
            borderColor="$borderColor"
            items="center"
          >
            <XStack items="center" content="space-between" width="100%">
              <Text fontSize="$3" fontWeight="700" width={90} text="left" color="$color">
                Standard
              </Text>
              <Switch
                size="$3"
                checked={selectedTier === SubscriptionTier.MAX}
                onCheckedChange={(checked) =>
                  setSelectedTier(checked ? SubscriptionTier.MAX : SubscriptionTier.STANDARD)
                }
                backgroundColor={
                  selectedTier === SubscriptionTier.MAX ? '$accent9' : '$borderColor'
                }
                borderColor={selectedTier === SubscriptionTier.MAX ? '$accent9' : '$borderColor'}
                shadowColor={selectedTier === SubscriptionTier.MAX ? '$accent9' : undefined}
                shadowOffset={
                  selectedTier === SubscriptionTier.MAX ? { width: 0, height: 2 } : undefined
                }
                shadowOpacity={selectedTier === SubscriptionTier.MAX ? 0.3 : undefined}
                shadowRadius={selectedTier === SubscriptionTier.MAX ? 4 : undefined}
                elevation={selectedTier === SubscriptionTier.MAX ? 4 : undefined}
              >
                <Switch.Thumb
                  animation="bouncy"
                  backgroundColor="white"
                  shadowColor="$accent9"
                  shadowOffset={{ width: 0, height: 1 }}
                  shadowOpacity={0.2}
                  shadowRadius={2}
                  elevation={2}
                />
              </Switch>
              <Text fontSize="$3" fontWeight="700" width={90} text="right" color="$color">
                MAX
              </Text>
            </XStack>
          </YStack>

          {/* Subscription Options */}
          <YStack gap="$2" mb="$4">
            <PriceCard
              title="Monthly"
              leftSub={
                currentProduct
                  ? `${formatPrice(currentProduct.unitAmount, currentProduct.currency)}/mo`
                  : ''
              }
              rightPrice={
                currentProduct && selectedCycle === BillingCycle.MONTHLY
                  ? `${formatPrice(currentProduct.unitAmount, currentProduct.currency)}`
                  : monthlyProductForTier
                    ? `${formatPrice(monthlyProductForTier.unitAmount, monthlyProductForTier.currency)}`
                    : ''
              }
              rightSub={
                monthlyProductForTier
                  ? `≈ ${formatPrice(Math.round(monthlyProductForTier.unitAmount / 30), monthlyProductForTier.currency)}/day`
                  : ''
              }
              selected={selectedCycle === BillingCycle.MONTHLY}
              onPress={() => setSelectedCycle(BillingCycle.MONTHLY)}
            />

            <PriceCard
              title="Yearly"
              leftSub={
                annualProductForTier
                  ? `12 mo • ${formatPrice(annualProductForTier.unitAmount, annualProductForTier.currency)}`
                  : ''
              }
              rightPrice={
                monthlyEquivalentOfAnnual && annualProductForTier
                  ? `${formatPrice(monthlyEquivalentOfAnnual, annualProductForTier.currency)}/mo`
                  : ''
              }
              rightSub={annualSavingsPercent !== null ? `Save ${annualSavingsPercent}%` : ''}
              selected={selectedCycle === BillingCycle.ANNUAL}
              onPress={() => setSelectedCycle(BillingCycle.ANNUAL)}
              showBadge={selectedCycle === BillingCycle.ANNUAL}
            />
          </YStack>

          <Button
            onPress={handlePurchase}
            disabled={isPurchasing}
            mb="$4"
            py="$3"
            px="$6"
            bg="$accent9"
            rounded="$3"
            width="100%"
            height="auto"
          >
            <Text fontSize="$5" fontWeight="800" color="white">
              {isPurchasing
                ? 'Processing…'
                : `Continue — ${selectedTier === SubscriptionTier.MAX ? 'Max' : 'Standard'} • ${selectedCycle === BillingCycle.ANNUAL && monthlyEquivalentOfAnnual && annualProductForTier ? `${formatPrice(monthlyEquivalentOfAnnual, annualProductForTier.currency)}/mo` : currentProduct ? (selectedCycle === BillingCycle.MONTHLY ? `${formatPrice(currentProduct.unitAmount, currentProduct.currency)}/mo` : formatPrice(currentProduct.unitAmount, currentProduct.currency)) : ''}`}
            </Text>
          </Button>

          <XStack content="center" items="center" gap="$3" mb="$4">
            <Lock size={14} />
            <Text fontSize="$2" color="$color10" text="center">
              End‑to‑end encrypted • Cancel anytime • No hidden fees
            </Text>
          </XStack>

          <XStack content="space-between" px="$5" mb="$4">
            <Button
              variant="outlined"
              onPress={handleRestorePurchases}
              py="$1"
              bg="transparent"
              borderWidth={0}
              height="auto"
            >
              <Text fontSize="$2" color="$color10" textDecorationLine="underline">
                Restore Purchases
              </Text>
            </Button>
            <Button
              variant="outlined"
              onPress={() => Alert.alert('Terms', 'Terms of Service')}
              py="$1"
              bg="transparent"
              borderWidth={0}
              height="auto"
            >
              <Text fontSize="$2" color="$color10" textDecorationLine="underline">
                Terms
              </Text>
            </Button>
            <Button
              variant="outlined"
              onPress={() => Alert.alert('Privacy', 'Privacy Policy')}
              py="$1"
              bg="transparent"
              borderWidth={0}
              height="auto"
            >
              <Text fontSize="$2" color="$color10" textDecorationLine="underline">
                Privacy
              </Text>
            </Button>
          </XStack>
        </Section>
      </ScrollView>

      {isPurchasing && (
        <YStack
          position="absolute"
          t={0}
          l={0}
          r={0}
          b={0}
          bg="rgba(0,0,0,0.5)"
          items="center"
          content="center"
          z={100}
        >
          <Text color="white" fontSize="$4" fontWeight="600" mt="$3">
            Processing your purchase...
          </Text>
        </YStack>
      )}
    </YStack>
  );
};
