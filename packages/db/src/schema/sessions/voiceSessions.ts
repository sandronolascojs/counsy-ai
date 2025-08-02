import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from '../user/index';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';

export const voiceSessions = pgTable(
  'voice_sessions',
  {
    voiceSessionId: generateIdField({ name: 'voice_session_id' }),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    startedAt: timestamp('started_at').defaultNow(),
    endedAt: timestamp('ended_at'),
    durationSec: integer('duration_sec'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('idx_voice_sessions_user_id_started_at_unique').on(table.userId, table.startedAt),
  ],
);
