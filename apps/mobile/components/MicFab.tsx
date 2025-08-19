import { useChatSheet } from '@/store';
import { Mic } from '@tamagui/lucide-icons';
import { Button } from 'tamagui';

export const MicFab = () => {
  const toggle = useChatSheet((state) => state.toggle);

  return (
    <Button
      circular
      size="$5"
      borderWidth="$0.25"
      borderColor="$borderColor"
      justify="center"
      icon={Mic}
      onPress={toggle}
      scaleIcon={1.5}
      theme="accent"
      role="button"
      aria-label="Hablar con Counsy"
      aria-describedby="Abre el chat para hablar con Counsy"
      hitSlop={8}
    />
  );
};
