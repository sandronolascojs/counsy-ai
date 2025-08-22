import { authClient } from '@/lib/auth';
import { Redirect } from 'expo-router';
import type { ReactElement } from 'react';

const Index = (): ReactElement | null => {
  const { data: session, isPending } = authClient.useSession();
  console.log('session', session);
  if (isPending) return null;
  return session?.user ? <Redirect href="/(private)" /> : <Redirect href="/(public)/sign-in" />;
};

export default Index;
