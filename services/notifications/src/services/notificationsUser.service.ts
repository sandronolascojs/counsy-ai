import { DB } from '@counsy-ai/db';
import type { SelectUser } from '@counsy-ai/db/schema';
import { Logger } from '@counsy-ai/shared';
import { Locale } from '@counsy-ai/types';
import { NotificationsUserRepository } from '../repositories/user.repository';

export class NotificationsUserService {
  constructor(
    private readonly userRepository: NotificationsUserRepository,
    private readonly logger: Logger,
    readonly db: DB,
  ) {
    this.userRepository = new NotificationsUserRepository(db, logger);
    this.logger = logger;
  }
  async getUserLocale({ userId }: { userId: string }): Promise<Locale | null> {
    const user = await this.userRepository.getUserById({ id: userId });
    if (!user) {
      this.logger.error('User not found in notifications user service', { userId });
      return null;
    }
    return await this.userRepository.getUserLocale({ userId: user.id });
  }

  async getUserById({ id }: { id: string }): Promise<SelectUser | undefined> {
    return await this.userRepository.getUserById({ id });
  }
}
