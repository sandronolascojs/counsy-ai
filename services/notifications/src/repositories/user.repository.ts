import { userPreferences } from '@counsy-ai/db/schema';
import { BaseUserRepository } from '@counsy-ai/shared';
import { Locale } from '@counsy-ai/types';
import { eq } from 'drizzle-orm';

export class NotificationsUserRepository extends BaseUserRepository {
  async getUserLocale({ userId }: { userId: string }): Promise<Locale | null> {
    const preferences = await this.db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, userId),
    });
    if (!preferences) {
      return null;
    }
    return preferences.locale;
  }
}
