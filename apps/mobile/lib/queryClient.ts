import { mobileLogger } from '@/utils/logger';
import { QueryClient } from '@tanstack/react-query';
import { isFetchError } from '@ts-rest/react-query/v5';

const FIVE_MINUTES = 5 * 60 * 1000;

let toastContextRef: WeakRef<{ error: (message: string) => void }> | null = null;

export const setToastContext = (context: { error: (message: string) => void }) => {
  toastContextRef = new WeakRef(context);
};

// Simple toast function that you can use anywhere - optimized for performance
export const toast = {
  error: (message: string) => {
    const context = toastContextRef?.deref();
    if (context) {
      context.error(message);
    }
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
    },
    mutations: {
      onError: (error) => {
        if (isFetchError(error)) {
          toast.error(error?.message ?? 'An error occurred');
        }
        mobileLogger.error(error.message, { error });
      },
    },
  },
});
