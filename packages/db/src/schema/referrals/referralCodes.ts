import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';

export const referralCodes = pgTable(
  'referral_codes',
  {
    referralCodeId: generateIdField({ name: 'referral_code_id' }),
    ownerUserId: text('owner_user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    code: text('code').notNull(),
    referralCodeSlug: text('referral_code_slug').notNull(),
    disabled: boolean('disabled').default(false),
    disabledAt: timestamp('disabled_at'),
    maxRedemptions: integer('max_redemptions'),
    expiresAt: timestamp('expires_at'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_referral_codes_code').on(table.code),
    uniqueIndex('idx_referral_codes_referral_code_slug').on(table.referralCodeSlug),
  ],
);

export const referralCodeRelations = relations(referralCodes, ({ one }) => ({
  ownerUser: one(users, {
    fields: [referralCodes.ownerUserId],
    references: [users.id],
  }),
}));

export type InsertReferralCode = typeof referralCodes.$inferInsert;
export type SelectReferralCode = typeof referralCodes.$inferSelect;
export type UpdateReferralCode = Partial<InsertReferralCode>;
