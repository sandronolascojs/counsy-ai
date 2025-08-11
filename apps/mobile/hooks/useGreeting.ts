import { GreetingsTranslations, NAMESPACES } from '@/i18n/constants';
import { useTranslation } from 'react-i18next';

export const useGreeting = () => {
  const { t } = useTranslation(NAMESPACES.GREETINGS);
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return t(GreetingsTranslations.GOOD_MORNING);
  if (hour >= 12 && hour < 18) return t(GreetingsTranslations.GOOD_AFTERNOON);
  if (hour >= 18 && hour < 22) return t(GreetingsTranslations.GOOD_EVENING);
  return t(GreetingsTranslations.GOOD_NIGHT);
};
