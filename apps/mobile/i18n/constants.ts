export enum NavigationTranslations {
  HOME = 'navigation.home',
  CHATS = 'navigation.chats',
  INSIGHTS = 'navigation.insights',
  ACCOUNT = 'navigation.account',
  BACK = 'navigation.back',
}

export enum GreetingsTranslations {
  HELLO = 'greetings.hello',
  WELCOME = 'greetings.welcome',
  GOODBYE = 'greetings.goodbye',
  GOOD_MORNING = 'greetings.good_morning',
  GOOD_AFTERNOON = 'greetings.good_afternoon',
  GOOD_EVENING = 'greetings.good_evening',
  GOOD_NIGHT = 'greetings.good_night',
}

export enum VoiceTranslations {
  SESSION = 'voice.session',
  LISTENING = 'voice.listening',
  SPEAK = 'voice.speak',
  STOP = 'voice.stop',
  STOPPED = 'voice.stopped',
  REMAINING_TIME = 'voice.remaining_time',
}

export enum SettingsTranslations {
  LANGUAGE_LABEL = 'settings.language.label',
  LANGUAGE_CHANGE = 'settings.language.change',
}

export enum AccountTranslations {
  TITLE = 'account.title',
  CHANGE_NAME_LABEL = 'account.change_name.label',
  CHANGE_NAME_DESCRIPTION = 'account.change_name.description',
  CHANGE_EMAIL_LABEL = 'account.change_email.label',
  CHANGE_EMAIL_DESCRIPTION = 'account.change_email.description',
  CHANGE_PASSWORD_LABEL = 'account.change_password.label',
  CHANGE_PASSWORD_DESCRIPTION = 'account.change_password.description',
  LANGUAGE_LABEL = 'account.language.label',
  LANGUAGE_DESCRIPTION = 'account.language.description',
}

export enum PreferencesTranslations {
  TITLE = 'preferences.title',
  DARK_MODE_LABEL = 'preferences.dark_mode.label',
  DARK_MODE_DESCRIPTION = 'preferences.dark_mode.description',
  CLOUD_SYNC_LABEL = 'preferences.cloud_sync.label',
  CLOUD_SYNC_DESCRIPTION = 'preferences.cloud_sync.description',
}

export enum SecurityTranslations {
  TITLE = 'security.title',
  TWO_FACTOR_LABEL = 'security.two_factor.label',
  TWO_FACTOR_DESCRIPTION = 'security.two_factor.description',
  MANAGE_DEVICES_LABEL = 'security.manage_devices.label',
  MANAGE_DEVICES_DESCRIPTION = 'security.manage_devices.description',
  SESSION_HISTORY_LABEL = 'security.session_history.label',
  SESSION_HISTORY_DESCRIPTION = 'security.session_history.description',
}

export enum DangerTranslations {
  TITLE = 'danger.title',
  DELETE_DATA_LABEL = 'danger.delete_data.label',
  DELETE_DATA_DESCRIPTION = 'danger.delete_data.description',
  PAUSE_ACCOUNT_LABEL = 'danger.pause_account.label',
  PAUSE_ACCOUNT_DESCRIPTION = 'danger.pause_account.description',
  DELETE_ACCOUNT_LABEL = 'danger.delete_account.label',
  DELETE_ACCOUNT_DESCRIPTION = 'danger.delete_account.description',
}

export enum AccountOverviewTranslations {
  OPEN = 'overview.open',
  LOGOUT = 'overview.logout',
  APP_VERSION = 'overview.app_version',
  ACCOUNT_DESCRIPTION = 'overview.account.description',
  SECURITY_DESCRIPTION = 'overview.security.description',
  PREFERENCES_DESCRIPTION = 'overview.preferences.description',
  DANGER_DESCRIPTION = 'overview.danger.description',
}

export enum CommonTranslations {
  ERROR_GENERIC = 'common.errors.generic',
}

export enum AuthTranslations {
  EMAIL_LABEL = 'auth.email.label',
  EMAIL_PLACEHOLDER = 'auth.email.placeholder',
  PASSWORD_LABEL = 'auth.password.label',
  PASSWORD_PLACEHOLDER = 'auth.password.placeholder',
  SIGN_IN = 'auth.sign_in',
  SIGNING_IN = 'auth.signing_in',
  SIGN_IN_WITH_EMAIL = 'auth.sign_in_with_email',
  WELCOME_TITLE = 'auth.welcome_title',
  WELCOME_SUBTITLE = 'auth.welcome_subtitle',
  CONTINUE_WITH_EMAIL = 'auth.continue_with_email',
  CONTINUE_WITH_APPLE = 'auth.continue_with_apple',
  CONTINUE_WITH_GOOGLE = 'auth.continue_with_google',
  OR = 'auth.or',
  AND = 'auth.and',
  LEGAL_PREFIX = 'auth.legal_prefix',
  TERMS = 'auth.terms',
  PRIVACY = 'auth.privacy',
  SKIP = 'auth.skip',
}

export const NAMESPACES = {
  NAVIGATION: 'navigation',
  GREETINGS: 'greetings',
  VOICE: 'voice',
  SETTINGS: 'settings',
  ACCOUNT: 'account',
  AUTH: 'auth',
  COMMON: 'common',
} as const;
