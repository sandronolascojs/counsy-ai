import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, Stack } from 'expo-router';
import { Paragraph, Theme, YStack } from 'tamagui';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />

      <Theme name={colorScheme}>
        <YStack flex={1} items="center" justify="center" gap="$4" p="$6" background="$background">
          <Paragraph size="$8" fontWeight="700" text="center">
            This screen does not exist.
          </Paragraph>

          <Link href="/" asChild>
            <Button size="$5" variant="outline">
              Go to home screen
            </Button>
          </Link>
        </YStack>
      </Theme>
    </>
  );
}
