import { useChatSheet } from '@/store';
import { MicOff, StopCircle } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress, Spinner, Text, YStack } from 'tamagui';
import { NAMESPACES, VoiceTranslations } from '../i18n/constants';
import { Button } from './ui/Button';
import { Sheet } from './ui/Sheet';

const CHAT_SHEET_SNAP_POINTS = [45];

export const ChatSheet = () => {
  const { open, toggle } = useChatSheet();
  const [recording, setRecording] = useState(false);
  const { t } = useTranslation(NAMESPACES.VOICE);

  const handleOpen = (next: boolean) => {
    if (next !== open) toggle();
  };

  return (
    <Sheet
      title={t(VoiceTranslations.SESSION)}
      open={open}
      handleOpen={handleOpen}
      sheetSnapPoints={CHAT_SHEET_SNAP_POINTS}
    >
      <YStack gap="$5">
        {/* Recording Status */}
        <YStack alignItems="center" gap="$3">
          {recording ? (
            <Spinner size="large" />
          ) : (
            <Button circular size="$9" icon={MicOff} disabled opacity={0.5} />
          )}
          <Text fontSize="$5" fontWeight="500" color="$color">
            {recording ? t(VoiceTranslations.LISTENING) : t(VoiceTranslations.STOPPED)}
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
            {t(VoiceTranslations.REMAINING_TIME, { time: 12, totalTime: 60 })}
          </Text>
        </YStack>

        {/* Action Button */}
        <Button icon={recording ? StopCircle : MicOff} onPress={() => setRecording(!recording)}>
          {recording ? t(VoiceTranslations.STOP) : t(VoiceTranslations.SPEAK)}
        </Button>
      </YStack>
    </Sheet>
  );
};
