import { SubscriptionPeriodType, SubscriptionStatus } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePackPurchases } from './minutePackPurchases';
import { plans } from './plans';
import { subscriptionChannel } from './subscriptionChannelEnum';

export const subscriptionStatus = pgEnum('subscription_status', [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.PENDING_PAYMENT,
  SubscriptionStatus.PENDING_CANCEL,
  SubscriptionStatus.CANCELLED,
]);

export const subscriptionPeriodType = pgEnum('subscription_period_type', [
  SubscriptionPeriodType.TRIAL,
  SubscriptionPeriodType.NORMAL,
]);

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
    channel: subscriptionChannel('channel').notNull(),
    externalId: text('external_id'),
    status: subscriptionStatus('status').notNull(),
    periodType: subscriptionPeriodType('period_type')
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
