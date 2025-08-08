import { useGreeting } from '@/hooks/useGreeting';
import { Text, YStack } from 'tamagui';

export function Greeting() {
  const greeting = useGreeting();

  return (
    <YStack gap="$1">
      <Text fontSize="$8" fontWeight="700">
        {greeting},
      </Text>
      <Text fontSize="$7" theme="alt2">
        Matias.
      </Text>
    </YStack>
  );
}
