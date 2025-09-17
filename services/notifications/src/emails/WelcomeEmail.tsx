import { APP_CONFIG, Locale, MailTemplateId, type MailTemplateProps } from '@counsy-ai/types';
import { Button, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES, WelcomeTranslations as WT } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type WelcomeEmailProps = MailTemplateProps<MailTemplateId.WELCOME>;

const ASSETS = {
  banner: 'https://assets.counsy.ai/email/welcome-banner.png',
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> & { PreviewProps: WelcomeEmailProps } = ({
  firstName,
  locale,
}) => {
  return (
    <BaseTemplate
      previewText={te(
        locale,
        WT.PREVIEW,
        { brandName: APP_CONFIG.basics.name, firstName: firstName },
        EMAIL_NAMESPACES.WELCOME,
      )}
      locale={locale}
    >
      <Section className="text-center pt-2 pb-3">
        <Text className="text-[24px] leading-8 font-extrabold m-0">
          {te(locale, WT.TITLE, { brandName: APP_CONFIG.basics.name }, EMAIL_NAMESPACES.WELCOME)}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, WT.SUBTITLE, { firstName }, EMAIL_NAMESPACES.WELCOME)}
        </Text>
        <Button
          className="bg-brand text-white py-3 px-12 rounded-full font-semibold no-underline inline-block mt-3"
          href="https://app.counsy.ai"
        >
          {te(locale, WT.CTA, { brandName: APP_CONFIG.basics.name }, EMAIL_NAMESPACES.WELCOME)}
        </Button>
        <Text className="text-xs text-slate-500 m-0 mt-2">
          {te(locale, WT.MUTED, undefined, EMAIL_NAMESPACES.WELCOME)}
        </Text>
      </Section>

      <Section className="bg-bg border border-border rounded-xl p-4 mt-2">
        <Text className="text-base font-bold m-0 mb-2">
          {te(locale, WT.CARD_TITLE, undefined, EMAIL_NAMESPACES.WELCOME)}
        </Text>
        <ul className="m-0 mb-2 ml-5 text-dark text-sm">
          <li>{te(locale, WT.LIST_1, undefined, EMAIL_NAMESPACES.WELCOME)}</li>
          <li>{te(locale, WT.LIST_2, undefined, EMAIL_NAMESPACES.WELCOME)}</li>
          <li>{te(locale, WT.LIST_3, undefined, EMAIL_NAMESPACES.WELCOME)}</li>
        </ul>
        <Text className="text-[13px] text-muted m-0">
          {te(locale, WT.HELP_1, undefined, EMAIL_NAMESPACES.WELCOME)}{' '}
          <Link href="https://counsy.ai/docs" className="text-brand underline">
            {te(locale, WT.HELP_2, undefined, EMAIL_NAMESPACES.WELCOME)}
          </Link>
          .
        </Text>
      </Section>

      <Section className="mt-2">
        <Text className="text-xs text-muted m-0">
          {te(locale, WT.NOTE, undefined, EMAIL_NAMESPACES.WELCOME)}
        </Text>
      </Section>
    </BaseTemplate>
  );
};

export default WelcomeEmail;

// Static preview props for design tooling
WelcomeEmail.PreviewProps = {
  firstName: 'John',
  locale: Locale.EN_US,
} satisfies WelcomeEmailProps;
