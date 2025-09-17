import {
  MAIL_TEMPLATE_SCHEMAS,
  MailTemplateId,
  type MailTemplateProps,
  type MailTemplateSchema,
} from '@counsy-ai/types';
import { render } from '@react-email/render';
import * as React from 'react';
import MagicLinkEmail from '../emails/MagicLinkEmail';
import ResetPasswordEmail from '../emails/ResetPasswordEmail';
import SubscriptionActiveEmail from '../emails/SubscriptionActiveEmail';
import SubscriptionPastDueEmail from '../emails/SubscriptionPastDueEmail';
import SubscriptionTrialEndEmail from '../emails/SubscriptionTrialEndEmail';
import TrialStartEmail from '../emails/TrialStartEmail';
import WelcomeEmail from '../emails/WelcomeEmail';

// Create a type-safe registry using a mapped type
type TemplateRegistry = {
  [K in MailTemplateId]: React.ComponentType<MailTemplateProps<K>>;
};

// Map enum template IDs to React email components with proper typing
const templateRegistry: TemplateRegistry = {
  [MailTemplateId.WELCOME]: WelcomeEmail,
  [MailTemplateId.RESET_PASSWORD]: ResetPasswordEmail,
  [MailTemplateId.MAGIC_LINK]: MagicLinkEmail,
  [MailTemplateId.SUBSCRIPTION_TRIAL_START]: TrialStartEmail,
  [MailTemplateId.SUBSCRIPTION_TRIAL_END]: SubscriptionTrialEndEmail,
  [MailTemplateId.SUBSCRIPTION_ACTIVE]: SubscriptionActiveEmail,
  [MailTemplateId.SUBSCRIPTION_PAST_DUE]: SubscriptionPastDueEmail,
};

export const emailRender = async <T extends MailTemplateId>(
  template: T,
  props: MailTemplateProps<T>,
): Promise<string> => {
  const Component = templateRegistry[template];
  // Runtime validation using zod schemas per template id
  const schema = MAIL_TEMPLATE_SCHEMAS[template] as MailTemplateSchema<T>;
  const parsed = schema.safeParse(props);
  if (!parsed.success) {
    throw new Error(`Invalid props for template ${template}: ${parsed.error.message}`);
  }
  return await render(React.createElement(Component, parsed.data));
};
