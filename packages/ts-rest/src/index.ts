import { billingRouter } from './billing';

export const contract: {
  billingContract: typeof billingRouter;
} = {
  billingContract: billingRouter,
};
