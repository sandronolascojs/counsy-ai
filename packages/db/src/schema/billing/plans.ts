import { SubscriptionTier } from '@counsy-ai/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { planChannelProducts } from './planChannelProducts';

export const planName = pgEnum('plan_name', [SubscriptionTier.STANDARD, SubscriptionTier.MAX]);

export const plans = pgTable(
  'plans',
  {
    planId: generateIdField({ name: 'plan_id' }),
    name: planName('name').notNull(),
    minutesIncluded: integer('minutes_included').notNull(),
    features: jsonb('features').$type<string[]>(),
    updatedAt: updatedAtField,
    createdAt: createdAtField,
  },
  (table) => [uniqueIndex('idx_plans_name_unique').on(table.name)],
);

export const planRelations = relations(plans, ({ many }) => ({
  planChannelProducts: many(planChannelProducts),
}));

export type InsertPlan = typeof plans.$inferInsert;
export type SelectPlan = typeof plans.$inferSelect;
export type UpdatePlan = Partial<InsertPlan>;
