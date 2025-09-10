import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { planChannelProducts } from './planChannelProducts';

export const planChannelPrices = pgTable(
  'plan_channel_prices',
  {
    planChannelPriceId: generateIdField({ name: 'plan_channel_price_id' }),
    planChannelProductId: text('plan_channel_product_id')
      .references(() => planChannelProducts.planChannelProductId, { onDelete: 'cascade' })
      .notNull(),
    unitAmount: integer('unit_amount').notNull(), // 2499
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).notNull(),
    effectiveTo: timestamp('effective_to', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_plan_channel_prices_plan_channel_product_id_unique').on(
      table.planChannelProductId,
    ),
  ],
);

export const planChannelPriceRelations = relations(planChannelPrices, ({ one }) => ({
  planChannelProduct: one(planChannelProducts, {
    fields: [planChannelPrices.planChannelProductId],
    references: [planChannelProducts.planChannelProductId],
  }),
}));

export type InsertPlanChannelPrice = typeof planChannelPrices.$inferInsert;
export type SelectPlanChannelPrice = typeof planChannelPrices.$inferSelect;
export type UpdatePlanChannelPrice = Partial<InsertPlanChannelPrice>;
