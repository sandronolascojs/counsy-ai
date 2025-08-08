import { DEFAULT_SHEET_SNAP_POINTS, OVERLAY_OPACITY } from '@/constants/sheet';
import { X as XIcon } from '@tamagui/lucide-icons';
import { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sheet as TamaguiSheet, Text, XStack, YStack } from 'tamagui';
import { Button } from './Button';

interface SheetProps {
  title?: string;
  open: boolean;
  handleOpen: () => void;
  children: ReactNode;
  sheetSnapPoints?: number[];
}

export const Sheet = ({
  title = 'Sheet',
  open,
  handleOpen,
  children,
  sheetSnapPoints = DEFAULT_SHEET_SNAP_POINTS,
}: SheetProps) => {
  const insets = useSafeAreaInsets();

  return (
    <TamaguiSheet
      modal
      open={open}
      native
      onOpenChange={handleOpen}
      snapPoints={sheetSnapPoints}
      dismissOnSnapToBottom
      moveOnKeyboardChange
      animation="fast-in"
    >
      <TamaguiSheet.Overlay
        animation="fast-in"
        opacity={OVERLAY_OPACITY}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="$color"
      />
      <TamaguiSheet.Frame
        padding="$4"
        gap="$5"
        backgroundColor="$background"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        paddingBottom={insets.bottom}
      >
        <YStack backgroundColor="$background">
          <TamaguiSheet.Handle
            width="15%"
            height={5}
            borderRadius="$10"
            backgroundColor="$borderColor"
            alignSelf="center"
          />
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$6" fontWeight="700">
              {title}
            </Text>
            <Button
              variant="ghost"
              size="$2"
              icon={XIcon}
              onPress={handleOpen}
              aria-label="Close"
            />
          </XStack>
        </YStack>
        {children}
      </TamaguiSheet.Frame>
    </TamaguiSheet>
  );
};
