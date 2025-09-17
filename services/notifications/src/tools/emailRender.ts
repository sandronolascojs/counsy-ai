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
import TrialStartEmail from '../emails/TrialStartEmail';
import WelcomeEmail from '../emails/WelcomeEmail';

type TemplateComponentMap = Partial<Record<MailTemplateId, React.ComponentType<any>>>;

// Map enum template IDs to React email components
const templateRegistry: TemplateComponentMap = {
  [MailTemplateId.WELCOME]: WelcomeEmail,
  [MailTemplateId.RESET_PASSWORD]: ResetPasswordEmail,
  [MailTemplateId.MAGIC_LINK]: MagicLinkEmail,
  [MailTemplateId.SUBSCRIPTION_TRIAL_START]: TrialStartEmail,
  [MailTemplateId.SUBSCRIPTION_ACTIVE]: SubscriptionActiveEmail,
  [MailTemplateId.SUBSCRIPTION_PAST_DUE]: SubscriptionPastDueEmail,
};

export const emailRender = async <T extends MailTemplateId>(
  template: T,
  props: MailTemplateProps<T>,
): Promise<string> => {
  const Component = templateRegistry[template] as React.FC<MailTemplateProps<T>> | undefined;
  if (!Component) {
    throw new Error(`Email template not implemented for id: ${template}`);
  }
  // Runtime validation using zod schemas per template id
  const schema = MAIL_TEMPLATE_SCHEMAS[template] as MailTemplateSchema<T>;
  const parsed = schema.safeParse(props);
  if (!parsed.success) {
    throw new Error(`Invalid props for template ${template}: ${parsed.error.message}`);
  }
  return await render(React.createElement(Component, parsed.data));
};
