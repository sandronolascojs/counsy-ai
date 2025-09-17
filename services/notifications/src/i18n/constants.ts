export const EMAIL_NAMESPACES = {
  COMMON: 'common',
  WELCOME: 'welcome',
  RESET_PASSWORD: 'reset_password',
  TRIAL_START: 'trial_start',
  SUBSCRIPTION_ACTIVE: 'subscription_active',
  SUBSCRIPTION_PAST_DUE: 'subscription_past_due',
} as const;

export enum EmailCommonTranslations {
  FOOTER_RECEIVING = 'footer.receiving',
  FOOTER_HELP = 'footer.help',
  FOOTER_RIGHTS = 'footer.rights',
}

export enum WelcomeTranslations {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  CTA = 'cta',
  MUTED = 'muted',
  CARD_TITLE = 'card_title',
  LIST_1 = 'list.1',
  LIST_2 = 'list.2',
  LIST_3 = 'list.3',
  HELP_1 = 'help.1',
  HELP_2 = 'help.2',
  NOTE = 'note',
  PREVIEW = 'preview',
}

export enum TrialStartTranslations {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  CTA_START = 'cta_start',
  DETAILS_TITLE = 'details_title',
  LABEL_PLAN = 'labels.plan',
  LABEL_BILLING_PERIOD = 'labels.billing_period',
  LABEL_TRIAL_DURATION = 'labels.trial_duration',
  LABEL_TRIAL_RANGE = 'labels.trial_range',
  LABEL_FIRST_CHARGE = 'labels.first_charge',
  NOTE_PREFIX = 'note_prefix',
  NOTE_LINK_TEXT = 'note_link_text',
  PREVIEW = 'preview',
}

export enum SubscriptionActiveTranslations {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  DETAILS_TITLE = 'details_title',
  LABEL_PLAN = 'labels.plan',
  LABEL_BILLING_PERIOD = 'labels.billing_period',
  LABEL_STARTED_ON = 'labels.started_on',
  LABEL_NEXT_CHARGE = 'labels.next_charge',
  CTA_MANAGE = 'cta_manage',
  PREVIEW = 'preview',
}

export enum SubscriptionPastDueTranslations {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  DETAILS_TITLE = 'details_title',
  LABEL_PLAN = 'labels.plan',
  LABEL_BILLING_PERIOD = 'labels.billing_period',
  LABEL_AMOUNT_DUE = 'labels.amount_due',
  CTA_PAY_NOW = 'cta_pay_now',
  PREVIEW = 'preview',
}
