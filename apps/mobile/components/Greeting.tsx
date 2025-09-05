import { useGreeting } from '@/hooks/useGreeting';
import { Text, YStack } from 'tamagui';

export const Greeting = () => {
  const greeting = useGreeting();
  return (
    <YStack gap="$1">
      <Text fontSize="$8" fontWeight="700">
        {greeting},
      </Text>
      <Text fontSize="$7" theme="accent">
        Matias.
      </Text>
    </YStack>
  );
};
