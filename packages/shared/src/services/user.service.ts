import type { DB } from '@counsy-ai/db';
import type { SelectUser } from '@counsy-ai/db/schema';
import type { Logger } from '@counsy-ai/shared';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
    private readonly db: DB,
  ) {
    this.logger = logger;
    this.db = db;
    this.userRepository = new UserRepository(db, logger);
  }

  async getUserById({ id }: { id: string }): Promise<SelectUser | undefined> {
    return await this.userRepository.getUserById({ id });
  }

  async getUserByEmail({ email }: { email: string }): Promise<SelectUser | undefined> {
    return await this.userRepository.getUserByEmail({ email });
  }
}
