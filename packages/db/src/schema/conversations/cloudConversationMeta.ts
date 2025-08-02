import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';

export const cloudConversationMeta = pgTable(
  'cloud_conversation_meta',
  {
    cloudConversationMetaId: generateIdField({ name: 'cloud_conversation_meta_id' }),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    objectKey: text('object_key').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    sha256: text('sha256').notNull(),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('idx_cloud_conversation_meta_user_id').on(table.userId),
    uniqueIndex('idx_cloud_conversation_meta_object_key').on(table.objectKey),
  ],
);

export const cloudConversationMetaRelations = relations(cloudConversationMeta, ({ one }) => ({
  user: one(users, {
    fields: [cloudConversationMeta.userId],
    references: [users.id],
  }),
}));
