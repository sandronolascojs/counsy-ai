import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { Link } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, YStack } from 'tamagui';

interface Props {}

export const LegalFooter = ({}: Props) => {
  const { t } = useTranslation([NAMESPACES.AUTH]);
  return (
    <YStack gap="$2" mb="$4" items="center">
      <Text color="$color" opacity={0.7}>
        {t(AuthTranslations.LEGAL_PREFIX)}{' '}
        <Link href="https://counsy.app/terms" asChild>
          <Text textDecorationLine="underline">{t(AuthTranslations.TERMS)}</Text>
        </Link>{' '}
        {t(AuthTranslations.AND)}{' '}
        <Link href="https://counsy.app/privacy" asChild>
          <Text textDecorationLine="underline">{t(AuthTranslations.PRIVACY)}</Text>
        </Link>
        .
      </Text>
    </YStack>
  );
};

export default LegalFooter;
