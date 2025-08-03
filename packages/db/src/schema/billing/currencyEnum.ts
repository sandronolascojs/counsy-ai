import { Currency } from '@counsy-ai/types';
import { pgEnum } from 'drizzle-orm/pg-core';

export const currency = pgEnum('currency', [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.AUD,
  Currency.NZD,
  Currency.CHF,
  Currency.JPY,
  Currency.CNY,
]);
