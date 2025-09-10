import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePackProducts } from './minutePackProducts';
import { minutePackPurchases } from './minutePackPurchases';
import { plans } from './plans';

export const minutePacks = pgTable(
  'minute_packs',
  {
    minutePackId: generateIdField({ name: 'minute_pack_id' }),
    planId: text('plan_id')
      .references(() => plans.planId, { onDelete: 'cascade' })
      .notNull(),
    minutes: integer('minutes').notNull(),
    name: text('name').notNull(), // 'Extra 60 min'
    description: text('description'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_minute_packs_plan_id_minutes_unique').on(table.planId, table.minutes),
  ],
);

export const minutePackRelations = relations(minutePacks, ({ many }) => ({
  minutePackProducts: many(minutePackProducts),
  minutePackPurchases: many(minutePackPurchases),
}));

export type InsertMinutePack = typeof minutePacks.$inferInsert;
export type SelectMinutePack = typeof minutePacks.$inferSelect;
export type UpdateMinutePack = Partial<InsertMinutePack>;
