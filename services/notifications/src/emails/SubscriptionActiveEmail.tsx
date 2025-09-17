import { formatMoneyFromCents, fromIsoToReadableDate } from '@counsy-ai/shared';
import {
  BillingCycle,
  Currency,
  Locale,
  MailTemplateId,
  type MailTemplateProps,
} from '@counsy-ai/types';
import { Button, Section, Text } from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES, SubscriptionActiveTranslations as SA } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type SubscriptionActiveEmailProps = MailTemplateProps<MailTemplateId.SUBSCRIPTION_ACTIVE> & {
  startedAtISO: string;
  nextChargeISO: string;
  amount: number;
  currency: Currency;
  billingPeriod?: BillingCycle;
};

export const SubscriptionActiveEmail: React.FC<SubscriptionActiveEmailProps> & {
  PreviewProps: SubscriptionActiveEmailProps;
} = ({ locale, planName, startedAtISO, nextChargeISO, amount, currency, billingPeriod }) => {
  const nextCharge = formatMoneyFromCents(amount, { currency });
  return (
    <BaseTemplate
      previewText={te(locale, SA.PREVIEW, { planName }, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
      locale={locale}
    >
      <Section className="text-center pt-2 pb-3">
        <Text className="text-[20px] leading-7 font-extrabold m-0">
          {te(locale, SA.TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, SA.SUBTITLE, { planName }, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
        </Text>
      </Section>

      <Section className="bg-bg border border-border rounded-xl p-4 mt-2">
        <Text className="text-base font-bold m-0 mb-2">
          {te(locale, SA.DETAILS_TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
        </Text>
        <table className="w-full text-sm text-dark">
          <tbody>
            <tr>
              <td className="py-1">
                {te(locale, SA.LABEL_PLAN, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
              </td>
              <td className="py-1 text-right font-medium">{planName}</td>
            </tr>
            {billingPeriod ? (
              <tr>
                <td className="py-1">
                  {te(
                    locale,
                    SA.LABEL_BILLING_PERIOD,
                    undefined,
                    EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE,
                  )}
                </td>
                <td className="py-1 text-right font-medium">{billingPeriod}</td>
              </tr>
            ) : null}
            {startedAtISO ? (
              <tr>
                <td className="py-1">
                  {te(locale, SA.LABEL_STARTED_ON, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
                </td>
                <td className="py-1 text-right font-medium">
                  {fromIsoToReadableDate(startedAtISO)}
                </td>
              </tr>
            ) : null}
            {nextCharge || nextChargeISO ? (
              <tr>
                <td className="py-1">
                  {te(
                    locale,
                    SA.LABEL_NEXT_CHARGE,
                    undefined,
                    EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE,
                  )}
                </td>
                <td className="py-1 text-right font-medium">
                  {nextCharge || fromIsoToReadableDate(nextChargeISO)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Section>

      <Section className="text-center mt-3">
        <Button
          href="https://app.counsy.ai/billing"
          className="bg-brand text-white py-3 px-12 rounded-full font-semibold no-underline inline-block"
        >
          {te(locale, SA.CTA_MANAGE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_ACTIVE)}
        </Button>
      </Section>
    </BaseTemplate>
  );
};

export default SubscriptionActiveEmail;

// Static preview props for design tooling
SubscriptionActiveEmail.PreviewProps = {
  locale: Locale.EN_US,
  planName: 'Pro',
  startedAtISO: '2025-09-01',
  nextChargeISO: '2025-09-08',
  amount: 1000,
  currency: Currency.USD,
  billingPeriod: BillingCycle.WEEKLY,
} satisfies SubscriptionActiveEmailProps;
