import { queryClient, setToastContext } from '@/lib/queryClient';
import { tsr } from '@/lib/tsrClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useToast } from './ui/Toast';

export const QueryClientProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const isContextSet = useRef(false);

  useEffect(() => {
    // Only set context once to avoid unnecessary updates
    if (!isContextSet.current) {
      setToastContext({ error: toast.error });
      isContextSet.current = true;
    }
  }, [toast.error]);

  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
};
