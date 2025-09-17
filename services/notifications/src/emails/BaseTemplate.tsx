import { APP_CONFIG, Locale } from '@counsy-ai/types';
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';
import { te } from '../i18n';
import { EmailCommonTranslations as CT, EMAIL_NAMESPACES } from '../i18n/constants';

export type BaseTemplateProps = {
  previewText?: string;
  locale: Locale;
  children: React.ReactNode;
};

const BRAND = {
  name: APP_CONFIG.basics.name,
  url: APP_CONFIG.basics.url,
  // Adapted to apps/mobile theme palette
  primary: '#6E56CF', // accent (FALLBACK_BRAND_COLOR_HEX)
  dark: '#0A0A0A', // ~ hsla(0, 0%, 6-10%)
  lightText: '#4D4D4D', // ~ 30% gray
  border: '#E6E6E6', // lighter border to match header divider
  bg: '#F5F5F5', // ~ 96% gray
  banner: 'https://assets.counsy.app/banner-email-counsy-ai.jpg',
};

export const BaseTemplate: React.FC<BaseTemplateProps> = ({ previewText, locale, children }) => {
  return (
    <Html>
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: BRAND.primary,
                dark: BRAND.dark,
                muted: BRAND.lightText,
                border: BRAND.border,
                bg: BRAND.bg,
              },
              borderRadius: {
                xl: '12px',
              },
            },
          },
        }}
      >
        <Body className="bg-white font-sans">
          <Container
            className="mx-auto w-full max-w-[600px] p-0 rounded-2xl overflow-hidden bg-white"
            style={{ border: `1px solid ${BRAND.border}` }}
          >
            {/* Branded banner full-width on top */}
            <Section className="p-0 m-0">
              <Img
                src={BRAND.banner}
                alt={`${BRAND.name} banner`}
                width={600}
                style={{ width: '100%', height: 200, display: 'block', objectFit: 'cover' }}
              />
            </Section>

            {/* Brand header with logo (left) + name (left, dark) */}
            <Section className="px-8 pt-5 pb-3 text-left">
              <Row>
                <Column align="left" className="w-auto" style={{ verticalAlign: 'middle' }}>
                  <Img
                    src="https://assets.counsy.app/logo.svg"
                    alt={`${BRAND.name} logo`}
                    width={40}
                    height={40}
                    style={{ display: 'block' }}
                  />
                </Column>
                <Column align="left" style={{ verticalAlign: 'middle' }}>
                  <Text
                    className="m-0 p-0 font-bold text-[19px] leading-none tracking-tight"
                    style={{ color: BRAND.dark, marginLeft: 12 }}
                  >
                    {BRAND.name}
                  </Text>
                  <Text
                    className="m-0 p-0 text-[14px]"
                    style={{
                      color: BRAND.lightText,
                      marginLeft: 12,
                      marginTop: 6,
                      lineHeight: 1.45,
                      maxWidth: 520,
                    }}
                  >
                    {locale === Locale.ES_ES
                      ? 'Asesor de IA 24/7 para tu calma, claridad y bienestar.'
                      : 'Always‑on AI counselor for calm, clarity, and better days.'}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="my-0" style={{ borderColor: '#E6E6E6' }} />

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Section className="px-8 py-6">{children as any}</Section>

            <Hr className="border-border my-6" />

            <Section className="pt-2 text-center px-8 pb-8">
              <Text className="text-xs text-muted m-0 mb-1">
                {te(
                  locale,
                  CT.FOOTER_RECEIVING,
                  { brandName: BRAND.name },
                  EMAIL_NAMESPACES.COMMON,
                )}
              </Text>
              <Text className="text-xs text-muted m-0 mb-1">
                {te(locale, CT.FOOTER_HELP, undefined, EMAIL_NAMESPACES.COMMON)}{' '}
                <Link href={BRAND.url} className="text-brand underline">
                  {BRAND.url.replace('https://', '')}
                </Link>
              </Text>
              <Text className="text-[11px] text-muted m-0">
                &copy; {new Date().getFullYear()} {BRAND.name}.{' '}
                {te(locale, CT.FOOTER_RIGHTS, undefined, EMAIL_NAMESPACES.COMMON)}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BaseTemplate;
