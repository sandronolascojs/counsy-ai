import { useChatSheet } from '@/store';
import { Mic } from '@tamagui/lucide-icons';
import { Button } from './ui/Button';

export const MicFab = () => {
  const toggle = useChatSheet((state) => state.toggle);

  return (
    <Button
      circular
      size="$5"
      b="$0.25"
      justify="center"
      icon={Mic}
      onPress={toggle}
      scaleIcon={1.5}
      theme="accent"
      self="center"
      role="button"
      aria-label="Hablar con Counsy"
      aria-describedby="Abre el chat para hablar con Counsy"
      hitSlop={8}
    />
  );
};
