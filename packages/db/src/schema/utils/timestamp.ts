import { timestamp } from 'drizzle-orm/pg-core';

export const createdAtField = timestamp('created_at', { withTimezone: true })
  .notNull()
  .defaultNow();
export const updatedAtField = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
