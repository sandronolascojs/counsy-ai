import { useChatSheet } from '@/store';
import { MicOff, StopCircle } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Button, Progress, Sheet, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export function ChatSheet() {
  const { open, toggle } = useChatSheet();
  const [recording, setRecording] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(open: boolean) => !open && toggle()}
      modal
      snapPoints={[40, 95]}
      dismissOnSnapToBottom
      moveOnKeyboardChange
    >
      <Sheet.Overlay />

      <Sheet.Frame padding="$4" gap="$5">
        <Theme name="light">
          {/* header */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="700">Sesión</Text>
            <Button chromeless size="$3" icon={MicOff} onPress={toggle} aria-label="Cerrar" />
          </XStack>

          <YStack alignItems="center" gap="$3" marginVertical="$2">
            {recording ? (
              <Spinner size="large" color="primary" />
            ) : (
              <Button circular size="$9" icon={MicOff} disabled />
            )}
            <Text theme="alt2">{recording ? 'Escuchando…' : 'Detenido'}</Text>
          </YStack>

          <YStack alignItems="center" gap="$2">
            <Progress value={12} max={60} width="70%">
              <Progress.Indicator backgroundColor="primary" />
            </Progress>
            <Text theme="alt2">12 / 60 min restantes</Text>
          </YStack>

          <Button
            size="$5"
            icon={recording ? StopCircle : MicOff}
            theme={recording ? 'destructive' : 'primary'}
            onPress={() => setRecording(!recording)}
          >
            {recording ? 'Detener' : 'Hablar'}
          </Button>
        </Theme>
      </Sheet.Frame>
    </Sheet>
  );
}
