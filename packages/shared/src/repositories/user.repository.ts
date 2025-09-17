import { users, type SelectUser } from '@counsy-ai/db/schema';
import { BaseRepository } from '@counsy-ai/shared';
import { eq } from 'drizzle-orm';

export class UserRepository extends BaseRepository {
  async getUserByEmail({ email }: { email: string }): Promise<SelectUser | undefined> {
    return await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async getUserById({ id }: { id: string }): Promise<SelectUser | undefined> {
    return await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }
}
