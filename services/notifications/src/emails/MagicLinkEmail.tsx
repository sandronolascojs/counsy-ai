import { APP_CONFIG, Locale, MailTemplateId, type MailTemplateProps } from '@counsy-ai/types';
import { Button, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type MagicLinkEmailProps = MailTemplateProps<MailTemplateId.MAGIC_LINK>;

export const MagicLinkEmail: React.FC<MagicLinkEmailProps> & {
  PreviewProps: MagicLinkEmailProps;
} = ({ magicLinkUrl, firstName, locale }) => {
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
            'welcome.title',
            { brandName: APP_CONFIG.basics.name },
            EMAIL_NAMESPACES.WELCOME,
          )}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {firstName
            ? `${firstName}, use the button below to sign in.`
            : 'Use the button below to sign in.'}
        </Text>
        <Button
          className="bg-brand text-white py-3 px-10 rounded-full font-semibold no-underline inline-block mt-3"
          href={magicLinkUrl}
        >
          Sign in
        </Button>
        <Text className="text-xs text-muted m-0 mt-2">
          If the button doesn't work, copy and paste this link:{' '}
          <Link className="text-brand underline" href={magicLinkUrl}>
            {magicLinkUrl}
          </Link>
        </Text>
      </Section>
    </BaseTemplate>
  );
};

export default MagicLinkEmail;

MagicLinkEmail.PreviewProps = {
  firstName: 'John',
  magicLinkUrl: 'https://app.counsy.ai/auth/magic-link?token=dummytoken',
  locale: Locale.EN_US,
} satisfies MagicLinkEmailProps;
