import { AuthTranslations, NAMESPACES } from '@/i18n/constants';
import { useTranslation } from 'react-i18next';
import { Separator, Text, XStack } from 'tamagui';

export const OrSeparator = () => {
  const { t } = useTranslation([NAMESPACES.AUTH]);

  return (
    <XStack items="center" gap="$3">
      <Separator flex={1} />
      <Text color="$color" opacity={0.7}>
        {t(AuthTranslations.OR)}
      </Text>
      <Separator flex={1} />
    </XStack>
  );
};
