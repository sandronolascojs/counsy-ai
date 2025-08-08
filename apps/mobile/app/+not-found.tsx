import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, Stack } from 'expo-router';
import { Button, Paragraph, Theme, YStack } from 'tamagui';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />

      <Theme name={colorScheme}>
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          gap="$4"
          padding="$6"
          backgroundColor="$background"
        >
          <Paragraph size="$8" fontWeight="700" textAlign="center">
            This screen does not exist.
          </Paragraph>

          <Link href="/" asChild>
            <Button size="$5" theme="primary">
              Go to home screen
            </Button>
          </Link>
        </YStack>
      </Theme>
    </>
  );
}
