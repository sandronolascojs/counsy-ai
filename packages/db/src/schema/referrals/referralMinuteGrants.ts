import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { referralRedemptions } from './referralRedemptions';

export const referralMinuteGrants = pgTable(
  'referral_minute_grants',
  {
    referralMinuteGrantId: generateIdField({ name: 'referral_minute_grant_id' }),
    referralRedemptionId: text('referral_redemption_id')
      .references(() => referralRedemptions.referralRedemptionId, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    minutesGranted: integer('minutes_granted').notNull().default(10),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('idx_referral_minute_grants_referral_redemption_id_user_id').on(
      table.referralRedemptionId,
      table.userId,
    ),
  ],
);

export const referralMinuteGrantRelations = relations(referralMinuteGrants, ({ one }) => ({
  referralRedemption: one(referralRedemptions, {
    fields: [referralMinuteGrants.referralRedemptionId],
    references: [referralRedemptions.referralRedemptionId],
  }),
  user: one(users, {
    fields: [referralMinuteGrants.userId],
    references: [users.id],
  }),
}));

export type InsertReferralMinuteGrant = typeof referralMinuteGrants.$inferInsert;
export type SelectReferralMinuteGrant = typeof referralMinuteGrants.$inferSelect;
export type UpdateReferralMinuteGrant = Partial<InsertReferralMinuteGrant>;
