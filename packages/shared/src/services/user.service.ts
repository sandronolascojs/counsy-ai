import type { DB } from '@counsy-ai/db';
import type { SelectUser } from '@counsy-ai/db/schema';
import type { Logger } from '@counsy-ai/shared';
import { BaseUserRepository } from '../repositories/user.repository';

export class BaseUserService {
  constructor(
    readonly userRepository: BaseUserRepository,
    readonly logger: Logger,
    readonly db: DB,
  ) {
    this.logger = logger;
    this.db = db;
    this.userRepository = new BaseUserRepository(db, logger);
  }

  async getUserById({ id }: { id: string }): Promise<SelectUser | undefined> {
    return await this.userRepository.getUserById({ id });
  }

  async getUserByEmail({ email }: { email: string }): Promise<SelectUser | undefined> {
    return await this.userRepository.getUserByEmail({ email });
  }
}
