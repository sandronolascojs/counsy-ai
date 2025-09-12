import { render } from '@react-email/render';
import * as React from 'react';
import MyEmail from '../emails/MyEmail';

export type TemplateName = 'MyEmail';

const templateRegistry: Record<TemplateName, React.FC<any>> = {
  MyEmail,
};

export const emailRender = async <TProps extends Record<string, unknown>>(
  template: TemplateName,
  props: TProps,
): Promise<string> => {
  const Component = templateRegistry[template];
  return await render(React.createElement(Component, props));
};
