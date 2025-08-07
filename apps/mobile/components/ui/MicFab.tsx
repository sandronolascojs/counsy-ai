import { useChatSheet } from '@/store';
import { Mic } from '@tamagui/lucide-icons';
import { Platform } from 'react-native';
import { Button } from 'tamagui';

export const MicFab = () => {
  const toggle = useChatSheet((state) => state.toggle);

  return (
    <Button
      size="$7"
      circular
      elevate
      position="absolute"
      bottom={Platform.select({
        ios: 84,
        default: 72,
      })}
      alignSelf="center"
      theme="accent"
      scale={0.9}
      pressStyle={{ scale: 0.85 }}
      animation="bouncy"
      icon={Mic}
      onPress={toggle}
      aria-label="Hablar con Counsy"
    />
  );
};
