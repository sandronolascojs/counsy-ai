import { fromIsoToReadableDate } from '@counsy-ai/shared';
import { Locale, MailTemplateId, type MailTemplateProps } from '@counsy-ai/types';
import { Button, Section, Text } from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES, SubscriptionTrialEndTranslations as STE } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type SubscriptionTrialEndEmailProps =
  MailTemplateProps<MailTemplateId.SUBSCRIPTION_TRIAL_END>;

export const SubscriptionTrialEndEmail: React.FC<SubscriptionTrialEndEmailProps> & {
  PreviewProps: SubscriptionTrialEndEmailProps;
} = ({ locale, endedAtISO }) => {
  return (
    <BaseTemplate
      previewText={te(locale, STE.PREVIEW, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
      locale={locale}
    >
      <Section className="text-center pt-2 pb-3">
        <Text className="text-[20px] leading-7 font-extrabold m-0">
          {te(locale, STE.TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, STE.SUBTITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
        </Text>
      </Section>

      <Section className="bg-bg border border-border rounded-xl p-4 mt-2">
        <Text className="text-base font-bold m-0 mb-2">
          {te(locale, STE.DETAILS_TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
        </Text>
        <table className="w-full text-sm text-dark">
          <tbody>
            <tr>
              <td className="py-1">
                {te(locale, STE.LABEL_ENDED_ON, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
              </td>
              <td className="py-1 text-right font-medium">{fromIsoToReadableDate(endedAtISO)}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section className="text-center mt-3">
        <Button
          href="https://app.counsy.ai/billing"
          className="bg-brand text-white py-3 px-12 rounded-full font-semibold no-underline inline-block"
        >
          {te(locale, STE.CTA_UPGRADE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_TRIAL_END)}
        </Button>
      </Section>
    </BaseTemplate>
  );
};

export default SubscriptionTrialEndEmail;

// Static preview props for design tooling
SubscriptionTrialEndEmail.PreviewProps = {
  locale: Locale.EN_US,
  endedAtISO: '2025-09-01',
} satisfies SubscriptionTrialEndEmailProps;
