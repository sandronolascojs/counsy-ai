import { formatMoneyFromCents, fromIsoToReadableDate } from '@counsy-ai/shared';
import {
  BillingCycle,
  Currency,
  Locale,
  MailTemplateId,
  type MailTemplateProps,
} from '@counsy-ai/types';
import { Button, Link, Section, Text } from '@react-email/components';
import { addDays } from 'date-fns';
import * as React from 'react';
import { te } from '../i18n';
import { EMAIL_NAMESPACES, TrialStartTranslations as TS } from '../i18n/constants';
import BaseTemplate from './BaseTemplate';

export type TrialStartEmailProps = MailTemplateProps<MailTemplateId.SUBSCRIPTION_TRIAL_START>;

const describePeriod = (locale: Locale, period: BillingCycle) => {
  const key =
    period === BillingCycle.WEEKLY
      ? 'billing.weekly'
      : period === BillingCycle.ANNUAL
        ? 'billing.annual'
        : 'billing.monthly';
  return te(locale, key, undefined, EMAIL_NAMESPACES.TRIAL_START);
};

export const TrialStartEmail: React.FC<TrialStartEmailProps> & {
  PreviewProps: TrialStartEmailProps;
} = ({ locale, firstName, startDateISO, trialDays, planName, billingPeriod, amount, currency }) => {
  const endDate = addDays(new Date(startDateISO), trialDays);

  return (
    <BaseTemplate
      previewText={te(
        locale,
        TS.PREVIEW,
        { endDate: fromIsoToReadableDate(endDate) },
        EMAIL_NAMESPACES.TRIAL_START,
      )}
      locale={locale}
    >
      <Section className="text-center pt-2 pb-3">
        <Text className="text-[20px] leading-7 font-extrabold m-0">
          {te(locale, TS.TITLE, { firstName }, EMAIL_NAMESPACES.TRIAL_START)}
        </Text>
        <Text className="text-sm text-muted m-0 mt-1">
          {te(locale, TS.SUBTITLE, { days: trialDays }, EMAIL_NAMESPACES.TRIAL_START)}
        </Text>
        <Button
          className="bg-brand text-white py-3 px-12 rounded-full font-semibold no-underline inline-block mt-3"
          href="https://app.counsy.ai"
        >
          {te(locale, TS.CTA_START, undefined, EMAIL_NAMESPACES.TRIAL_START)}
        </Button>
      </Section>

      <Section className="bg-bg border border-border rounded-xl p-4 mt-2">
        <Text className="text-base font-bold m-0 mb-2">
          {te(locale, TS.DETAILS_TITLE, undefined, EMAIL_NAMESPACES.TRIAL_START)}
        </Text>
        <table className="w-full text-sm text-dark">
          <tbody>
            <tr>
              <td className="py-1">
                {te(locale, TS.LABEL_PLAN, undefined, EMAIL_NAMESPACES.TRIAL_START)}
              </td>
              <td className="py-1 text-right font-medium">{planName}</td>
            </tr>
            <tr>
              <td className="py-1">
                {te(locale, TS.LABEL_BILLING_PERIOD, undefined, EMAIL_NAMESPACES.TRIAL_START)}
              </td>
              <td className="py-1 text-right font-medium">
                {describePeriod(locale, billingPeriod)}
              </td>
            </tr>
            <tr>
              <td className="py-1">
                {te(locale, TS.LABEL_FIRST_CHARGE, undefined, EMAIL_NAMESPACES.TRIAL_START)}
              </td>
              <td className="py-1 text-right font-semibold">
                {formatMoneyFromCents(amount, { currency })} (
                {describePeriod(locale, billingPeriod)})
              </td>
            </tr>
            <tr>
              <td className="py-1">
                {te(locale, TS.LABEL_TRIAL_DURATION, undefined, EMAIL_NAMESPACES.TRIAL_START)}
              </td>
              <td className="py-1 text-right font-medium">
                {te(
                  locale,
                  trialDays === 1 ? 'value.day' : 'value.days',
                  { count: trialDays },
                  EMAIL_NAMESPACES.TRIAL_START,
                )}
              </td>
            </tr>
            <tr>
              <td className="py-1">
                {te(locale, TS.LABEL_TRIAL_RANGE, undefined, EMAIL_NAMESPACES.TRIAL_START)}
              </td>
              <td className="py-1 text-right font-medium">
                {fromIsoToReadableDate(startDateISO)} – {fromIsoToReadableDate(endDate)}
              </td>
            </tr>
          </tbody>
        </table>
        <Text className="text-[13px] text-slate-600 m-0 mt-2">
          {te(locale, TS.NOTE_PREFIX, undefined, EMAIL_NAMESPACES.TRIAL_START)}{' '}
          <Link href="https://app.counsy.ai/billing" className="text-brand underline">
            {te(locale, TS.NOTE_LINK_TEXT, undefined, EMAIL_NAMESPACES.TRIAL_START)}
          </Link>
          .
        </Text>
      </Section>
    </BaseTemplate>
  );
};

export default TrialStartEmail;

// Static preview props for design tooling
TrialStartEmail.PreviewProps = {
  locale: Locale.EN_US,
  firstName: 'John',
  startDateISO: '2025-09-13',
  trialDays: 7,
  planName: 'Pro',
  billingPeriod: BillingCycle.WEEKLY,
  amount: 1000,
  currency: Currency.USD,
} satisfies TrialStartEmailProps;
