import { OVERLAY_OPACITY, SHEET_SNAP_POINTS } from '@/constants/sheet';
import { useChatSheet } from '@/store';
import { MicOff, StopCircle, X as XIcon } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Progress, Sheet, Spinner, Text, XStack, YStack } from 'tamagui';

export function ChatSheet() {
  const { open, toggle } = useChatSheet();
  const [recording, setRecording] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <Sheet
      modal
      open={open}
      native
      onOpenChange={(open: boolean) => !open && toggle()}
      snapPoints={SHEET_SNAP_POINTS}
      dismissOnSnapToBottom
      moveOnKeyboardChange
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        opacity={OVERLAY_OPACITY}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="$color"
      />
      <Sheet.Frame
        padding="$4"
        gap="$5"
        backgroundColor="$background"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        paddingBottom={insets.bottom}
      >
        <YStack gap="$5">
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$6" fontWeight="700">
              Sesión
            </Text>
            <Button
              size="$2"
              icon={XIcon}
              borderWidth="$0"
              backgroundColor="transparent"
              color="$color"
              scaleIcon={1.5}
              onPress={toggle}
              aria-label="Cerrar"
              pressStyle={{ opacity: 0.7 }}
              hoverStyle={{ opacity: 0.8 }}
            />
          </XStack>

          {/* Recording Status */}
          <YStack alignItems="center" gap="$3">
            {recording ? (
              <Spinner size="large" />
            ) : (
              <Button circular size="$9" icon={MicOff} disabled opacity={0.5} />
            )}
            <Text fontSize="$5" fontWeight="500" color="$color">
              {recording ? 'Escuchando…' : 'Detenido'}
            </Text>
          </YStack>

          {/* Progress */}
          <YStack alignItems="center" gap="$2">
            <Progress
              value={12}
              max={60}
              height="$1"
              backgroundColor="$borderColor"
              borderWidth="$0.25"
              borderColor="$borderColor"
            >
              <Progress.Indicator animation="bouncy" backgroundColor="$accentColor" />
            </Progress>
            <Text fontSize="$3" fontWeight="500" color="$color">
              12 / 60 min restantes
            </Text>
          </YStack>

          {/* Action Button */}
          <Button
            size="$4"
            icon={recording ? StopCircle : MicOff}
            onPress={() => setRecording(!recording)}
            fontWeight="600"
            animation="bouncy"
            theme="accent"
            pressStyle={{ scale: 0.97 }}
            gap="$0.25"
            scaleIcon={1.2}
          >
            {recording ? 'Detener' : 'Hablar'}
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
