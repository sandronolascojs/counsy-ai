import { relations } from 'drizzle-orm';
import { integer, pgTable, smallint, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';

export const encryptionKeys = pgTable(
  'encryption_keys',
  {
    encryptionKeyId: generateIdField({ name: 'encryption_key_id' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    wrappedKey: text('wrapped_key').notNull(), // AES-GCM(cipher) base64
    kdfSalt: text('kdf_salt').notNull(), // 16 B base64
    kdfMemory: integer('kdf_memory').notNull(), // 65536 KiB
    kdfIterations: integer('kdf_iterations').notNull(),
    kdfParallelism: smallint('kdf_parallelism').notNull(),
    checksum: text('checksum').notNull(), // sha256(dataKey)
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [uniqueIndex('idx_encryption_keys_user_id_unique').on(table.userId)],
);

export const encryptionKeyRelations = relations(encryptionKeys, ({ one }) => ({
  user: one(users, {
    fields: [encryptionKeys.userId],
    references: [users.id],
  }),
}));

export type InsertEncryptionKey = typeof encryptionKeys.$inferInsert;
export type SelectEncryptionKey = typeof encryptionKeys.$inferSelect;
export type UpdateEncryptionKey = Partial<InsertEncryptionKey>;
