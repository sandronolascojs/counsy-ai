import { Greeting } from '@/components/Greeting';
import { useChatSheet } from '@/store/chatSheet';
import { Mic } from '@tamagui/lucide-icons';
import { Button, Separator, YStack } from 'tamagui';

export default function HomeView() {
  const toggleSheet = useChatSheet((s) => s.toggle);

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap={24}
      backgroundColor="$background"
    >
      <Greeting />

      <Separator width={80} />

      <Button size="$10" circular theme="primary" icon={Mic} onPress={toggleSheet} />
    </YStack>
  );
}
