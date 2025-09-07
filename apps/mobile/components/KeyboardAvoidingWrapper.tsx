import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  iosOffset?: number;
}

export const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  iosOffset,
}) => {
  const insets = useSafeAreaInsets();
  const verticalOffset = Platform.OS === 'ios' ? (iosOffset ?? insets.top) : 0;
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: 'height' })}
      style={{ flex: 1 }}
      keyboardVerticalOffset={verticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
