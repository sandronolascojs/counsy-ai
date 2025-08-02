import { relations } from 'drizzle-orm';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { subscriptions } from '../billing';
import { voiceSessions } from '../sessions/voiceSessions';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { accounts } from './accounts';
import { sessions } from './sessions';
import { verifications } from './verifications';

export const users = pgTable('users', {
  id: generateIdField({ name: 'id' }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export const userRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  verifications: many(verifications),
  userVoiceSessions: one(voiceSessions, {
    fields: [users.id],
    references: [voiceSessions.userId],
  }),
  userSubscriptions: many(subscriptions),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
