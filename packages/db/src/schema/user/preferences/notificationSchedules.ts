import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { notificationTransporterEnum } from '../../utils/enums';
import { generateIdField } from '../../utils/id';
import { createdAtField, updatedAtField } from '../../utils/timestamp';
import { users } from '../users';

// Table for notification schedules
export const notificationSchedules = pgTable('notification_schedules', {
  id: generateIdField({ name: 'notification_schedule_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  channel: notificationTransporterEnum('channel').notNull(),
  startTime: text('start_time').notNull(), // HH:MM format 24h
  endTime: text('end_time').notNull(), // HH:MM format 24h
  timezone: text('timezone').notNull(), // Timezone for the schedule
  enabled: boolean('enabled').default(true).notNull(),
  weekdays: text('weekdays').notNull(), // JSON array of days [1,2,3,4,5] (1=Monday)
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export type InsertNotificationSchedules = typeof notificationSchedules.$inferInsert;
export type SelectNotificationSchedules = typeof notificationSchedules.$inferSelect;
export type UpdateNotificationSchedules = Partial<InsertNotificationSchedules>;
