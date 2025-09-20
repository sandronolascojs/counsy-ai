import { Platform } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { deviceTypeEnum, platformEnum } from '../utils/enums';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { users } from './users';

export const pushTokens = pgTable(
  'push_tokens',
  {
    pushTokenId: generateIdField({ name: 'push_token_id' }),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    platform: platformEnum('platform').default(Platform.EXPO).notNull(),
    deviceType: deviceTypeEnum('device_type').notNull(),
    token: text('token').notNull(),
    deviceId: text('device_id').notNull(), // Unique identifier for the device
    deviceName: text('device_name'), // Device name (e.g., "iPhone 12")
    deviceModel: text('device_model'), // Device model
    osVersion: text('os_version'), // OS version
    appVersion: text('app_version'), // App version
    isEnabled: boolean('is_enabled').default(true).notNull(), // Whether notifications are enabled
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }), // Last time this token was used
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_push_tokens_user_id_device').on(table.userId, table.deviceId),
    uniqueIndex('idx_push_tokens_token').on(table.token),
  ],
);

export const pushTokenRelations = relations(pushTokens, ({ one }) => ({
  user: one(users, {
    fields: [pushTokens.userId],
    references: [users.id],
  }),
}));
