import { formatMoneyFromCents } from '@counsy-ai/shared';
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
import { EMAIL_NAMESPACES, SubscriptionPastDueTranslations as PD } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type SubscriptionPastDueEmailProps =
  MailTemplateProps<MailTemplateId.SUBSCRIPTION_PAST_DUE> & {
    planName: string;
    billingPeriod: BillingCycle;
    amountDue: number; // in cents
    currency: Currency;
    payUrl?: string;
  };

export const SubscriptionPastDueEmail: React.FC<SubscriptionPastDueEmailProps> & {
  PreviewProps: SubscriptionPastDueEmailProps;
} = ({ locale, planName, billingPeriod, amountDue, currency, payUrl }) => {
  const due = formatMoneyFromCents(amountDue, { currency });
  return (
    <BaseTemplate
      previewText={te(locale, PD.PREVIEW, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
      locale={locale}
    >
      <Section className="text-center pt-2 pb-3">
        <Text className="text-[20px] leading-7 font-extrabold m-0">
          {te(locale, PD.TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, PD.SUBTITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
        </Text>
      </Section>

      <Section className="bg-bg border border-border rounded-xl p-4 mt-2">
        <Text className="text-base font-bold m-0 mb-2">
          {te(locale, PD.DETAILS_TITLE, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
        </Text>
        <table className="w-full text-sm text-dark">
          <tbody>
            {planName ? (
              <tr>
                <td className="py-1">
                  {te(locale, PD.LABEL_PLAN, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
                </td>
                <td className="py-1 text-right font-medium">{planName}</td>
              </tr>
            ) : null}
            <tr>
              <td className="py-1">
                {te(
                  locale,
                  PD.LABEL_BILLING_PERIOD,
                  undefined,
                  EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE,
                )}
              </td>
              <td className="py-1 text-right font-medium">{billingPeriod}</td>
            </tr>
            {due && (
              <tr>
                <td className="py-1">
                  {te(
                    locale,
                    PD.LABEL_AMOUNT_DUE,
                    undefined,
                    EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE,
                  )}
                </td>
                <td className="py-1 text-right font-semibold">{due}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section className="text-center mt-3">
        <Button
          href={payUrl ?? 'https://app.counsy.ai/billing'}
          className="bg-brand text-white py-3 px-12 rounded-full font-semibold no-underline inline-block"
        >
          {te(locale, PD.CTA_PAY_NOW, undefined, EMAIL_NAMESPACES.SUBSCRIPTION_PAST_DUE)}
        </Button>
      </Section>
    </BaseTemplate>
  );
};

export default SubscriptionPastDueEmail;

// Static preview props for design tooling
SubscriptionPastDueEmail.PreviewProps = {
  locale: Locale.EN_US,
  planName: 'Pro',
  billingPeriod: BillingCycle.WEEKLY,
  amountDue: 2599,
  currency: Currency.USD,
  payUrl: 'https://app.counsy.ai/billing',
} satisfies SubscriptionPastDueEmailProps;
