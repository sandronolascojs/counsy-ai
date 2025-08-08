import { useTranslation } from 'react-i18next';

export const useGreeting = () => {
  const { t } = useTranslation('common');
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return t('good_morning');
  if (hour >= 12 && hour < 18) return t('good_afternoon');
  if (hour >= 18 && hour < 22) return t('good_evening');
  return t('good_night');
};
