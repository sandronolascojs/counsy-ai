import { authClient } from '@/lib/auth';
import { Redirect } from 'expo-router';
import type { ReactElement } from 'react';

const Index = (): ReactElement | null => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (session?.user) return <Redirect href="/(private)" />;
  return <Redirect href="/(public)/sign-in" />;
};

export default Index;
