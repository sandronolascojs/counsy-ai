import { Currency } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { currencyEnum, subscriptionChannelEnum } from '../utils/enums';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { minutePacks } from './minutePacks';

export const minutePackProducts = pgTable(
  'minute_pack_products',
  {
    minutePackProductId: generateIdField({ name: 'minute_pack_product_id' }),
    minutePackId: text('minute_pack_id')
      .references(() => minutePacks.minutePackId, { onDelete: 'cascade' })
      .notNull(),
    channel: subscriptionChannelEnum('channel').notNull(),
    externalProductId: text('external_product_id').notNull(),
    currency: currencyEnum('currency').notNull().default(Currency.USD), // default to USD
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_minute_pack_products_minute_pack_id_channel_unique').on(
      table.minutePackId,
      table.channel,
    ),
    uniqueIndex('idx_minute_pack_products_external_product_id_unique').on(table.externalProductId),
  ],
);

export const minutePackProductRelations = relations(minutePackProducts, ({ one }) => ({
  minutePack: one(minutePacks, {
    fields: [minutePackProducts.minutePackId],
    references: [minutePacks.minutePackId],
  }),
}));

export type InsertMinutePackProduct = typeof minutePackProducts.$inferInsert;
export type SelectMinutePackProduct = typeof minutePackProducts.$inferSelect;
export type UpdateMinutePackProduct = Partial<InsertMinutePackProduct>;
