import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { coupons } from './coupons';
import { minutePackPurchases } from './minutePackPurchases';

export const couponRedemptions = pgTable(
  'coupon_redemptions',
  {
    couponRedemptionId: generateIdField({ name: 'coupon_redemption_id' }),
    couponId: text('coupon_id')
      .references(() => coupons.couponId, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    redeemedAt: timestamp('redeemed_at'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
    minutePackPurchaseId: text('minute_pack_purchase_id').references(
      () => minutePackPurchases.minutePackPurchaseId,
      { onDelete: 'set null' },
    ),
  },
  (table) => [
    uniqueIndex('idx_coupon_redemptions_coupon_id_user_id').on(table.couponId, table.userId),
  ],
);

export const couponRedemptionRelations = relations(couponRedemptions, ({ one }) => ({
  coupon: one(coupons, {
    fields: [couponRedemptions.couponId],
    references: [coupons.couponId],
  }),
  user: one(users, {
    fields: [couponRedemptions.userId],
    references: [users.id],
  }),
  minutePackPurchase: one(minutePackPurchases, {
    fields: [couponRedemptions.minutePackPurchaseId],
    references: [minutePackPurchases.minutePackPurchaseId],
  }),
}));

export type InsertCouponRedemption = typeof couponRedemptions.$inferInsert;
export type SelectCouponRedemption = typeof couponRedemptions.$inferSelect;
export type UpdateCouponRedemption = Partial<InsertCouponRedemption>;
