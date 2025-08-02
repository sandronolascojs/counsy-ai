import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePackProducts } from './minutePackProducts';

export const minutePackPrices = pgTable(
  'minute_pack_prices',
  {
    minutePackPriceId: generateIdField({ name: 'minute_pack_price_id' }),
    minutePackProductId: text('minute_pack_product_id')
      .references(() => minutePackProducts.minutePackProductId, {
        onDelete: 'cascade',
      })
      .notNull(),
    unitAmount: integer('unit_amount').notNull(), // 499
    storePriceTier: text('store_price_tier'),
    effectiveFrom: timestamp('effective_from').notNull(),
    effectiveTo: timestamp('effective_to'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('idx_minute_pack_prices_minute_pack_product_id_unique').on(
      table.minutePackProductId,
    ),
  ],
);

export const minutePackPriceRelations = relations(minutePackPrices, ({ one }) => ({
  minutePackProduct: one(minutePackProducts, {
    fields: [minutePackPrices.minutePackProductId],
    references: [minutePackProducts.minutePackProductId],
  }),
}));

export type InsertMinutePackPrice = typeof minutePackPrices.$inferInsert;
export type SelectMinutePackPrice = typeof minutePackPrices.$inferSelect;
export type UpdateMinutePackPrice = Partial<InsertMinutePackPrice>;
