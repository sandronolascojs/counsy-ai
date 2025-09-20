import { DateFormat } from './enums/dateFormat.enum';
import { FontSize } from './enums/fontSize.enum';
import { Locale } from './enums/locale.enum';
import { NotificationCategory } from './enums/notification/notificationCategory.enum';
import { NotificationTransporterType } from './enums/notification/notificationType.enum';
import { ProfileVisibility } from './enums/profileVisibility.enum';
import { Theme } from './enums/theme.enum';
import { TimeFormat } from './enums/timeFormat.enum';
import { Timezone } from './enums/timezone.enum';

// Re-export enums for convenience
export {
  DateFormat,
  FontSize,
  Locale,
  NotificationCategory,
  NotificationTransporterType,
  ProfileVisibility,
  Theme,
  TimeFormat,
  Timezone,
};

// Main user preferences
export interface UserPreferences {
  id: string;
  userId: string;
  locale: Locale;
  timezone: Timezone;
  country?: string; // ISO country code
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currency: string; // ISO currency code
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

// Granular notification preferences
export interface NotificationPreference {
  id: string;
  userId: string;
  notificationCategory: NotificationCategory;
  channel: NotificationTransporterType;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification schedules (quiet hours)
export interface NotificationSchedule {
  id: string;
  userId: string;
  channel: NotificationTransporterType;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  enabled: boolean;
  weekdays: number[]; // [1,2,3,4,5] where 1=Monday
  createdAt: Date;
  updatedAt: Date;
}

// Privacy preferences
export interface PrivacyPreferences {
  id: string;
  userId: string;
  dataSharing: boolean; // Share anonymous data for analytics
  marketingEmails: boolean; // Marketing emails
  thirdPartySharing: boolean; // Share with third parties
  profileVisibility: ProfileVisibility;
  locationTracking: boolean; // Location tracking
  analyticsTracking: boolean; // App analytics
  createdAt: Date;
  updatedAt: Date;
}

// Accessibility preferences
export interface AccessibilityPreferences {
  id: string;
  userId: string;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  voiceOver: boolean;
  colorBlindSupport: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy preferences (deprecated)
export interface LegacyPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Combined preferences type for easy access
export interface AllUserPreferences {
  user: UserPreferences;
  notifications: NotificationPreference[];
  schedules: NotificationSchedule[];
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

// Utility types for preference management
export interface NotificationPreferenceUpdate {
  notificationCategory: NotificationCategory;
  channel: NotificationTransporterType;
  enabled: boolean;
}

export interface UserPreferenceUpdate {
  locale?: Locale;
  timezone?: Timezone;
  country?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  currency?: string;
  theme?: Theme;
}

export interface PrivacyPreferenceUpdate {
  dataSharing?: boolean;
  marketingEmails?: boolean;
  thirdPartySharing?: boolean;
  profileVisibility?: ProfileVisibility;
  locationTracking?: boolean;
  analyticsTracking?: boolean;
}

export interface AccessibilityPreferenceUpdate {
  fontSize?: FontSize;
  highContrast?: boolean;
  reducedMotion?: boolean;
  screenReader?: boolean;
  voiceOver?: boolean;
  colorBlindSupport?: boolean;
}

// Constants for default values
export const DEFAULT_USER_PREFERENCES: Partial<UserPreferences> = {
  locale: Locale.EN_US,
  timezone: Timezone.UTC,
  dateFormat: DateFormat.MM_DD_YYYY,
  timeFormat: TimeFormat.TWELVE_HOUR,
  currency: 'USD',
  theme: Theme.SYSTEM,
};

export const DEFAULT_PRIVACY_PREFERENCES: Partial<PrivacyPreferences> = {
  dataSharing: false,
  marketingEmails: false,
  thirdPartySharing: false,
  profileVisibility: ProfileVisibility.PRIVATE,
  locationTracking: false,
  analyticsTracking: true,
};

export const DEFAULT_ACCESSIBILITY_PREFERENCES: Partial<AccessibilityPreferences> = {
  fontSize: FontSize.MEDIUM,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  voiceOver: false,
  colorBlindSupport: false,
};

// Notification category descriptions for UI
export const NOTIFICATION_CATEGORY_DESCRIPTIONS: Record<NotificationCategory, string> = {
  [NotificationCategory.ACCOUNT]: 'Account-related notifications (login, password changes, etc.)',
  [NotificationCategory.SUBSCRIPTION]: 'Subscription and billing notifications',
  [NotificationCategory.PROMOTIONAL]: 'Promotional and marketing emails',
  [NotificationCategory.SECURITY]: 'Security alerts and important account updates',
  [NotificationCategory.REMINDER]: 'Reminders and scheduled events',
  [NotificationCategory.SYSTEM]: 'System maintenance and updates',
  [NotificationCategory.CHAT]: 'Chat messages and conversations',
  [NotificationCategory.APPOINTMENT]: 'Appointment and session notifications',
};

// Channel descriptions for UI
export const NOTIFICATION_TRANSPORTER_DESCRIPTIONS: Record<NotificationTransporterType, string> = {
  [NotificationTransporterType.MAIL]: 'Email notifications',
  [NotificationTransporterType.EXPO]: 'Push notifications on your device',
  [NotificationTransporterType.SMS]: 'SMS text messages',
  [NotificationTransporterType.IN_APP]: 'In-app notifications',
};
