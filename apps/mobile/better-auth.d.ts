import type { SelectSubscription } from '@counsy-ai/db/schema';

declare module 'better-auth' {
  interface User {
    subscription?: SelectSubscription;
  }

  interface Session {
    user: User;
  }
}
