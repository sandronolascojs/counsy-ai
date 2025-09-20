import { SubscriptionPeriodType } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import {
  subscriptionChannelEnum,
  subscriptionPeriodTypeEnum,
  subscriptionStatusEnum,
} from '../utils/enums';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePackPurchases } from './minutePackPurchases';
import { plans } from './plans';

export const subscriptions = pgTable(
  'subscriptions',
  {
    subscriptionId: generateIdField({ name: 'subscription_id' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.planId),
    channel: subscriptionChannelEnum('channel').notNull(),
    externalId: text('external_id'),
    status: subscriptionStatusEnum('status').notNull(),
    periodType: subscriptionPeriodTypeEnum('period_type')
      .notNull()
      .default(SubscriptionPeriodType.NORMAL),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_subscriptions_user_external_unique').on(table.userId, table.externalId),
  ],
);

export const subscriptionRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.planId],
  }),
  minutePackPurchases: many(minutePackPurchases),
}));

export type InsertSubscription = typeof subscriptions.$inferInsert;
export type SelectSubscription = typeof subscriptions.$inferSelect;
export type UpdateSubscription = Partial<InsertSubscription>;
