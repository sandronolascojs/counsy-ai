import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { referralCodes } from './referralCodes';

export const referralRedemptions = pgTable(
  'referral_redemptions',
  {
    referralRedemptionId: generateIdField({ name: 'referral_redemption_id' }),
    referralCodeId: text('referral_code_id')
      .references(() => referralCodes.referralCodeId, { onDelete: 'cascade' })
      .notNull(),
    referredUserId: text('referred_user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_referral_redemptions_referral_code_id_referred_user_id').on(
      table.referralCodeId,
      table.referredUserId,
    ),
  ],
);

export const referralRedemptionRelations = relations(referralRedemptions, ({ one }) => ({
  referralCode: one(referralCodes, {
    fields: [referralRedemptions.referralCodeId],
    references: [referralCodes.referralCodeId],
  }),
  referredUser: one(users, {
    fields: [referralRedemptions.referredUserId],
    references: [users.id],
  }),
}));
