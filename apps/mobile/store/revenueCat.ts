import { env } from '@/config/env.config';
import { ENTITLEMENT_BY_TIER } from '@/constants/revenueCat';
import { authClient } from '@/lib/auth';
import { mobileLogger } from '@/utils/logger';
import { SubscriptionTier } from '@counsy-ai/types';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import { create } from 'zustand';

// Types
interface RevenueCatState {
  // State
  isConfigured: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  error: string | null;

  // Actions
  configure: () => Promise<void>;
  refresh: () => Promise<void>;
  findPackageByProductId: (id?: string | null) => PurchasesPackage | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo>;
  isActive: (tier: SubscriptionTier) => boolean;
  hasActiveSubscription: () => boolean;
  reset: () => void;
}

// Constants
const VERBOSE = __DEV__;

export const useRevenueCatStore = create<RevenueCatState>((set, get) => ({
  // Initial state
  isConfigured: false,
  isLoading: false,
  customerInfo: null,
  offerings: null,
  error: null,

  // Configure RevenueCat
  configure: async () => {
    const state = get();
    // Idempotent guard: don't configure if already configured or currently loading
    if (state.isConfigured || state.isLoading) return;

    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      set({ isConfigured: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Get current session
      const session = await authClient.getSession();
      if (!session?.data?.user?.id) {
        set({ isConfigured: false, isLoading: false, error: 'No authenticated user' });
        return;
      }

      // Get API key
      const apiKey =
        Platform.OS === 'ios' ? env.EXPO_PUBLIC_RC_API_KEY_IOS : env.EXPO_PUBLIC_RC_API_KEY_ANDROID;

      if (!apiKey) {
        throw new Error(`RevenueCat API key not found for ${Platform.OS}`);
      }

      // Configure RevenueCat
      Purchases.configure({
        apiKey,
        appUserID: session.data.user.id,
      });

      if (VERBOSE) {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        mobileLogger.info('RevenueCat configured', { userId: session.data.user.id });
      }

      // Load initial data
      const [customerInfo, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);

      set({
        isConfigured: true,
        isLoading: false,
        customerInfo,
        offerings,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to configure RevenueCat';
      mobileLogger.error('RevenueCat configuration failed', { error });

      set({
        isConfigured: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  // Refresh data
  refresh: async () => {
    const state = get();
    if (!state.isConfigured) return;

    try {
      const [customerInfo, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);

      set({
        customerInfo,
        offerings,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refresh RevenueCat data';
      mobileLogger.error('RevenueCat refresh failed', { error });

      set({ error: errorMessage });
    }
  },

  // Find package by product ID
  findPackageByProductId: (id?: string | null): PurchasesPackage | null => {
    const state = get();
    if (!id || !state.offerings?.current) return null;

    return (
      state.offerings.current.availablePackages.find((p) => p.product.identifier === id) ?? null
    );
  },

  // Purchase package
  purchasePackage: async (pkg: PurchasesPackage): Promise<CustomerInfo> => {
    const state = get();
    if (!state.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      set({ customerInfo });
      return customerInfo;
    } catch (error) {
      // Check if the purchase was cancelled by the user
      if (error && typeof error === 'object' && 'userCancelled' in error && error.userCancelled) {
        mobileLogger.info('Purchase cancelled by user');
      }

      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      mobileLogger.error('Purchase failed', { error });
      throw new Error(errorMessage);
    }
  },

  // Check if tier is active
  isActive: (tier: SubscriptionTier): boolean => {
    const state = get();
    const entitlementKey = ENTITLEMENT_BY_TIER[tier];
    return Boolean(state.customerInfo?.entitlements?.active?.[entitlementKey]);
  },

  // Check if has any active subscription
  hasActiveSubscription: (): boolean => {
    const state = get();
    if (!state.customerInfo?.entitlements?.active) return false;

    return Object.values(ENTITLEMENT_BY_TIER).some((entitlementKey) =>
      Boolean(state.customerInfo?.entitlements?.active?.[entitlementKey]),
    );
  },

  // Reset store
  reset: () => {
    const state = get();
    // Idempotent guard: don't reset if already reset (not configured and not loading)
    if (!state.isConfigured && !state.isLoading) return;

    set({
      isConfigured: false,
      isLoading: false,
      customerInfo: null,
      offerings: null,
      error: null,
    });
  },
}));
