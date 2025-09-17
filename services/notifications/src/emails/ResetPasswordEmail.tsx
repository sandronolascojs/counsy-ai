import { APP_CONFIG, Locale, MailTemplateId, type MailTemplateProps } from '@counsy-ai/types';
import { Button, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type ResetPasswordEmailProps = MailTemplateProps<MailTemplateId.RESET_PASSWORD>;

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> & {
  PreviewProps: ResetPasswordEmailProps;
} = ({ resetPasswordUrl, firstName, locale }) => {
  return (
    <BaseTemplate
      previewText={te(
        locale,
        'reset_password.preview',
        { brandName: APP_CONFIG.basics.name },
        EMAIL_NAMESPACES.COMMON,
      )}
      locale={locale}
    >
      <Section className="text-left pt-2 pb-3">
        <Text className="text-[22px] leading-7 font-extrabold m-0">
          {te(
            locale,
            'reset_password.title',
            { brandName: APP_CONFIG.basics.name },
            EMAIL_NAMESPACES.COMMON,
          )}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, 'reset_password.subtitle', { firstName }, EMAIL_NAMESPACES.COMMON)}
        </Text>
        <Button
          className="bg-brand text-white py-3 px-10 rounded-full font-semibold no-underline inline-block mt-3"
          href={resetPasswordUrl}
        >
          {te(locale, 'reset_password.cta', undefined, EMAIL_NAMESPACES.COMMON)}
        </Button>
        <Text className="text-xs text-slate-500 m-0 mt-2">
          {te(locale, 'reset_password.muted', undefined, EMAIL_NAMESPACES.COMMON)}
        </Text>
        <Text className="text-xs text-muted m-0 mt-2">
          {te(locale, 'reset_password.alt', undefined, EMAIL_NAMESPACES.COMMON)}{' '}
          <Link className="text-brand underline" href={resetPasswordUrl}>
            {resetPasswordUrl}
          </Link>
        </Text>
      </Section>
    </BaseTemplate>
  );
};

export default ResetPasswordEmail;

ResetPasswordEmail.PreviewProps = {
  resetPasswordUrl: 'https://app.counsy.ai/auth/reset?token=dummytoken',
  firstName: 'John',
  locale: Locale.EN_US,
} satisfies ResetPasswordEmailProps;
