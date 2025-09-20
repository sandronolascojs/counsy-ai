import { CountryCode, DateFormat, Locale, Theme, TimeFormat, Timezone } from '@counsy-ai/types';
import { pgTable, text } from 'drizzle-orm/pg-core';
import {
  countryCodeEnum,
  dateFormatEnum,
  localeEnum,
  themeEnum,
  timeFormatEnum,
  timezoneEnum,
} from '../../utils/enums';
import { generateIdField } from '../../utils/id';
import { createdAtField, updatedAtField } from '../../utils/timestamp';
import { users } from '../users';

export const userPreferences = pgTable('user_preferences', {
  id: generateIdField({ name: 'user_preference_id' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  locale: localeEnum('locale').default(Locale.EN_US).notNull(),
  timezone: timezoneEnum('timezone').default(Timezone.UTC).notNull(),
  country: countryCodeEnum('country').default(CountryCode.US).notNull(),
  dateFormat: dateFormatEnum('date_format').default(DateFormat.MM_DD_YYYY).notNull(),
  timeFormat: timeFormatEnum('time_format').default(TimeFormat.TWELVE_HOUR).notNull(),
  currency: text('currency').default('USD').notNull(),
  theme: themeEnum('theme').default(Theme.SYSTEM).notNull(),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type SelectUserPreferences = typeof userPreferences.$inferSelect;
export type UpdateUserPreferences = Partial<InsertUserPreferences>;
