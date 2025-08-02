import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePacks } from './minutePacks';
import { subscriptionChannel } from './subscriptionChannelEnum';
import { subscriptions } from './subscriptions';

export const minutePackPurchases = pgTable(
  'minute_pack_purchases',
  {
    minutePackPurchaseId: generateIdField({ name: 'minute_pack_purchase_id' }),
    subscriptionId: text('subscription_id')
      .references(() => subscriptions.subscriptionId, { onDelete: 'cascade' })
      .notNull(),
    minutePackId: text('minute_pack_id')
      .references(() => minutePacks.minutePackId, { onDelete: 'cascade' })
      .notNull(),
    externalId: text('external_id').notNull(), // transactionId, paymentIntentId…
    channel: subscriptionChannel('channel').notNull(),
    minutesGranted: integer('minutes_granted').notNull(),
    minutesUsed: integer('minutes_used').default(0),
    purchasedAt: timestamp('purchased_at').notNull(),
    refundedAt: timestamp('refunded_at'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_minute_pack_purchases_subscription_id_minute_pack_id_external_id_unique').on(
      table.subscriptionId,
      table.minutePackId,
      table.externalId,
    ),
  ],
);

export const minutePackPurchaseRelations = relations(minutePackPurchases, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [minutePackPurchases.subscriptionId],
    references: [subscriptions.subscriptionId],
  }),
  minutePack: one(minutePacks, {
    fields: [minutePackPurchases.minutePackId],
    references: [minutePacks.minutePackId],
  }),
}));

export type InsertMinutePackPurchase = typeof minutePackPurchases.$inferInsert;
export type SelectMinutePackPurchase = typeof minutePackPurchases.$inferSelect;
export type UpdateMinutePackPurchase = Partial<InsertMinutePackPurchase>;
