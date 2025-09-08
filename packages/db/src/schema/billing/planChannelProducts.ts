import { BillingCycle, Currency } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { currency } from './currencyEnum';
import { plans } from './plans';
import { subscriptionChannel } from './subscriptionChannelEnum';

export const billingCycle = pgEnum('billing_cycle', [
  BillingCycle.WEEKLY,
  BillingCycle.MONTHLY,
  BillingCycle.ANNUAL,
]);

export const planChannelProducts = pgTable(
  'plan_channel_products',
  {
    planChannelProductId: generateIdField({ name: 'plan_channel_product_id' }),
    planId: text('plan_id').references(() => plans.planId, { onDelete: 'cascade' }),
    channel: subscriptionChannel('channel').notNull(),
    externalProductId: text('external_product_id').notNull(),
    currency: currency('currency').notNull().default(Currency.USD), // default to USD
    billingCycle: billingCycle('billing_cycle').notNull().default(BillingCycle.MONTHLY),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_plan_channel_products_plan_id_channel_external_unique').on(
      table.planId,
      table.channel,
      table.externalProductId,
    ),
    uniqueIndex('idx_plan_channel_products_external_product_id_unique').on(table.externalProductId),
  ],
);

export const planChannelProductRelations = relations(planChannelProducts, ({ one }) => ({
  plan: one(plans, {
    fields: [planChannelProducts.planId],
    references: [plans.planId],
  }),
}));

export type InsertPlanChannelProduct = typeof planChannelProducts.$inferInsert;
export type SelectPlanChannelProduct = typeof planChannelProducts.$inferSelect;
export type UpdatePlanChannelProduct = Partial<InsertPlanChannelProduct>;
