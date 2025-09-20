import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { couponTypeEnum } from '../utils/enums';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { couponRedemptions } from './couponRedemptions';

export const coupons = pgTable(
  'coupons',
  {
    couponId: generateIdField({ name: 'coupon_id' }),
    code: text('code').notNull(), // 'PACK10OFF'
    description: text('description'),
    discountType: couponTypeEnum('discount_type').notNull(),
    amount: integer('amount'),
    minutesBonus: integer('minutes_bonus'),
    xpBonus: integer('xp_bonus'),
    maxRedemptions: integer('max_redemptions'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [uniqueIndex('idx_coupons_code').on(table.code)],
);

export const couponRelations = relations(coupons, ({ many }) => ({
  couponRedemptions: many(couponRedemptions),
}));

export type InsertCoupon = typeof coupons.$inferInsert;
export type SelectCoupon = typeof coupons.$inferSelect;
export type UpdateCoupon = Partial<InsertCoupon>;
