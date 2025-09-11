import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { users } from './users';

export const preferences = pgTable('preferences', {
  id: generateIdField({ name: 'preference_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  pushNotifications: boolean('push_notifications').default(true).notNull(),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});
