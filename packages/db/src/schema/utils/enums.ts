import {
  BillingCycle,
  CountryCode,
  CouponType,
  Currency,
  DateFormat,
  DeviceType,
  FontSize,
  Locale,
  NotificationCategory,
  NotificationTransporterType,
  Platform,
  ProfileVisibility,
  SubscriptionPeriodType,
  SubscriptionStatus,
  SubscriptionTier,
  SubscriptionVendor,
  Theme,
  TimeFormat,
  Timezone,
} from '@counsy-ai/types';
import { pgEnum } from 'drizzle-orm/pg-core';

// Notification enums
export const notificationCategoryEnum = pgEnum('notification_category', [
  NotificationCategory.ACCOUNT,
  NotificationCategory.SUBSCRIPTION,
  NotificationCategory.PROMOTIONAL,
  NotificationCategory.SECURITY,
  NotificationCategory.REMINDER,
  NotificationCategory.SYSTEM,
  NotificationCategory.CHAT,
  NotificationCategory.APPOINTMENT,
]);

export const notificationTransporterEnum = pgEnum('notification_transporter', [
  NotificationTransporterType.MAIL,
  NotificationTransporterType.EXPO,
  NotificationTransporterType.SMS,
  NotificationTransporterType.IN_APP,
]);

// User preference enums
export const localeEnum = pgEnum('locale', [
  Locale.EN_US,
  Locale.ES_ES,
  Locale.FR_FR,
  Locale.DE_DE,
  Locale.IT_IT,
  Locale.PT_PT,
  Locale.RU_RU,
  Locale.ZH_CN,
  Locale.JA_JP,
  Locale.KO_KR,
  Locale.PT_BR,
  Locale.AR_SA,
  Locale.ZH_TW,
  Locale.NL_NL,
  Locale.PL_PL,
  Locale.SV_SE,
  Locale.TR_TR,
  Locale.UK_UA,
  Locale.VI_VN,
  Locale.ID_ID,
  Locale.MS_MY,
  Locale.TH_TH,
  Locale.MS_SG,
]);

export const timezoneEnum = pgEnum('timezone', [
  Timezone.UTC,
  Timezone.AMERICA_NEW_YORK,
  Timezone.AMERICA_CHICAGO,
  Timezone.AMERICA_DENVER,
  Timezone.AMERICA_LOS_ANGELES,
  Timezone.AMERICA_TORONTO,
  Timezone.AMERICA_MEXICO_CITY,
  Timezone.AMERICA_SAO_PAULO,
  Timezone.AMERICA_BUENOS_AIRES,
  Timezone.AMERICA_VANCOUVER,
  Timezone.AMERICA_MONTREAL,
  Timezone.AMERICA_LIMA,
  Timezone.AMERICA_BOGOTA,
  Timezone.AMERICA_CARACAS,
  Timezone.AMERICA_SANTIAGO,
  Timezone.EUROPE_LONDON,
  Timezone.EUROPE_PARIS,
  Timezone.EUROPE_BERLIN,
  Timezone.EUROPE_MADRID,
  Timezone.EUROPE_ROME,
  Timezone.EUROPE_AMSTERDAM,
  Timezone.EUROPE_STOCKHOLM,
  Timezone.EUROPE_COPENHAGEN,
  Timezone.EUROPE_OSLO,
  Timezone.EUROPE_HELSINKI,
  Timezone.EUROPE_WARSAW,
  Timezone.EUROPE_MOSCOW,
  Timezone.EUROPE_ZURICH,
  Timezone.EUROPE_VIENNA,
  Timezone.EUROPE_DUBLIN,
  Timezone.EUROPE_LISBON,
  Timezone.EUROPE_ATHENS,
  Timezone.ASIA_TOKYO,
  Timezone.ASIA_SEOUL,
  Timezone.ASIA_SHANGHAI,
  Timezone.ASIA_HONG_KONG,
  Timezone.ASIA_SINGAPORE,
  Timezone.ASIA_DUBAI,
  Timezone.ASIA_KOLKATA,
  Timezone.ASIA_BANGKOK,
  Timezone.ASIA_JAKARTA,
  Timezone.ASIA_MANILA,
  Timezone.ASIA_TAIPEI,
  Timezone.ASIA_MUMBAI,
  Timezone.ASIA_KARACHI,
  Timezone.ASIA_DHAKA,
  Timezone.AUSTRALIA_SYDNEY,
  Timezone.AUSTRALIA_MELBOURNE,
  Timezone.AUSTRALIA_PERTH,
  Timezone.AUSTRALIA_ADELAIDE,
  Timezone.PACIFIC_AUCKLAND,
  Timezone.PACIFIC_HONOLULU,
  Timezone.PACIFIC_FIJI,
  Timezone.AFRICA_CAIRO,
  Timezone.AFRICA_JOHANNESBURG,
  Timezone.AFRICA_LAGOS,
  Timezone.AFRICA_CASABLANCA,
]);

export const dateFormatEnum = pgEnum('date_format', [
  DateFormat.MM_DD_YYYY,
  DateFormat.DD_MM_YYYY,
  DateFormat.YYYY_MM_DD,
]);

export const timeFormatEnum = pgEnum('time_format', [
  TimeFormat.TWELVE_HOUR,
  TimeFormat.TWENTY_FOUR_HOUR,
]);

export const themeEnum = pgEnum('theme', [Theme.LIGHT, Theme.DARK, Theme.SYSTEM]);

export const fontSizeEnum = pgEnum('font_size', [
  FontSize.SMALL,
  FontSize.MEDIUM,
  FontSize.LARGE,
  FontSize.EXTRA_LARGE,
]);

export const profileVisibilityEnum = pgEnum('profile_visibility', [
  ProfileVisibility.PUBLIC,
  ProfileVisibility.PRIVATE,
  ProfileVisibility.FRIENDS,
]);

export const countryCodeEnum = pgEnum('country_code', [
  CountryCode.US,
  CountryCode.CA,
  CountryCode.MX,
  CountryCode.GB,
  CountryCode.FR,
  CountryCode.DE,
  CountryCode.ES,
  CountryCode.IT,
  CountryCode.PT,
  CountryCode.RU,
  CountryCode.CN,
  CountryCode.JP,
  CountryCode.KR,
  CountryCode.BR,
  CountryCode.AR,
  CountryCode.AU,
  CountryCode.NZ,
  CountryCode.IN,
  CountryCode.ID,
  CountryCode.TH,
  CountryCode.MY,
  CountryCode.SG,
  CountryCode.AE,
  CountryCode.SA,
  CountryCode.EG,
  CountryCode.ZA,
  CountryCode.NG,
  CountryCode.KE,
  CountryCode.MA,
  // Add more countries as needed
]);

// Billing enums
export const currencyEnum = pgEnum('currency', [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.AUD,
  Currency.NZD,
  Currency.CHF,
  Currency.JPY,
  Currency.CNY,
]);

export const subscriptionChannelEnum = pgEnum('subscription_channel', [
  SubscriptionVendor.APPLE_IAP,
  SubscriptionVendor.GOOGLE_PLAY,
  SubscriptionVendor.STRIPE,
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  SubscriptionTier.STANDARD,
  SubscriptionTier.MAX,
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.PENDING_PAYMENT,
  SubscriptionStatus.PENDING_CANCEL,
  SubscriptionStatus.CANCELLED,
]);

export const subscriptionPeriodTypeEnum = pgEnum('subscription_period_type', [
  SubscriptionPeriodType.TRIAL,
  SubscriptionPeriodType.NORMAL,
]);

export const billingCycleEnum = pgEnum('billing_cycle', [
  BillingCycle.WEEKLY,
  BillingCycle.MONTHLY,
  BillingCycle.ANNUAL,
]);

export const couponTypeEnum = pgEnum('coupon_type', [
  CouponType.PERCENT,
  CouponType.FIXED,
  CouponType.BONUS_XP,
  CouponType.BONUS_MIN,
]);

// Device enums
export const deviceTypeEnum = pgEnum('device_type', [DeviceType.ANDROID, DeviceType.IOS]);

export const platformEnum = pgEnum('platform', [Platform.EXPO]);
