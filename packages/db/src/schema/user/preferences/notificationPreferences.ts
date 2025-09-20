import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { notificationCategoryEnum, notificationTransporterEnum } from '../../utils/enums';
import { generateIdField } from '../../utils/id';
import { createdAtField, updatedAtField } from '../../utils/timestamp';
import { users } from '../users';

// Table for notification preferences
export const notificationPreferences = pgTable('notification_preferences', {
  id: generateIdField({ name: 'notification_preference_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  notificationCategory: notificationCategoryEnum('notification_category').notNull(),
  channel: notificationTransporterEnum('channel').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;
export type SelectNotificationPreferences = typeof notificationPreferences.$inferSelect;
export type UpdateNotificationPreferences = Partial<InsertNotificationPreferences>;
