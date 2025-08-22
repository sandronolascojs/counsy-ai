import { authClient } from '@/lib/auth';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

type AuthGuardMode = 'private' | 'public';

interface UseAuthNavigationGuardOptions {
  mode: AuthGuardMode;
}

interface UseAuthNavigationGuardResult {
  isBlocking: boolean;
}

export const useAuthNavigationGuard = ({
  mode,
}: UseAuthNavigationGuardOptions): UseAuthNavigationGuardResult => {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const isFirstResolutionRef = useRef<boolean>(true);

  useEffect(() => {
    if (isPending) return;

    const hasUser = !!session?.user;
    const shouldGoPublic = mode === 'private' && !hasUser;
    const shouldGoPrivate = mode === 'public' && hasUser;
    const target = shouldGoPublic ? '/(public)/sign-in' : shouldGoPrivate ? '/(private)' : null;

    if (target && pathname !== target) {
      router.replace(target);
    }

    if (isFirstResolutionRef.current) {
      isFirstResolutionRef.current = false;
    }
  }, [isPending, mode, pathname, session?.user]);

  const isOnPublicLogin = pathname === '/(public)/sign-in';
  const isOnPrivateRoot = pathname?.startsWith('/(private)');

  const isRedirectingAway =
    (mode === 'private' && !session?.user && !isOnPublicLogin) ||
    (mode === 'public' && !!session?.user && !isOnPrivateRoot);

  const isFirstResolutionPending = isFirstResolutionRef.current && isPending;

  return { isBlocking: isFirstResolutionPending || isPending || isRedirectingAway };
};

export default useAuthNavigationGuard;
