import { billingRouter } from './billing';
import { publicRouter } from './public';
export type { RevenueCatPayload } from './public';

export const contract: {
  billingContract: typeof billingRouter;
  publicContract: typeof publicRouter;
} = {
  billingContract: billingRouter,
  publicContract: publicRouter,
};
