import { MAIL_TEMPLATE_SCHEMAS, MailTemplateId, type MailTemplateProps } from '@counsy-ai/types';
import { render } from '@react-email/render';
import * as React from 'react';
import MyEmail from '../emails/MyEmail';

type TemplateComponent = React.FC<Record<string, unknown>>;

// Map enum template IDs to React email components
const templateRegistry: Partial<Record<MailTemplateId, TemplateComponent>> = {
  [MailTemplateId.WELCOME]: MyEmail,
};

export const emailRender = async <T extends MailTemplateId>(
  template: T,
  props: MailTemplateProps<T>,
): Promise<string> => {
  const Component = templateRegistry[template];
  if (!Component) {
    throw new Error(`Email template not implemented for id: ${template}`);
  }
  // Runtime validation using zod schemas per template id
  const schema = MAIL_TEMPLATE_SCHEMAS[template];
  const parsed = schema.safeParse(props);
  if (!parsed.success) {
    throw new Error(`Invalid props for template ${template}: ${parsed.error.message}`);
  }
  return await render(React.createElement(Component, parsed.data as Record<string, unknown>));
};
