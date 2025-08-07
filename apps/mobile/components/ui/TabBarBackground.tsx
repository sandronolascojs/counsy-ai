import React from 'react';
import { Platform } from 'react-native';
import { useTheme, View, YStack } from 'tamagui';

export function TabBarBackground() {
  const theme = useTheme();
  const backgroundColor = theme.background?.get();

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <YStack
        style={{
          backgroundColor,
          borderTopWidth: theme.borderWidth?.get(),
          borderTopColor: theme.borderColor?.get(),
          height: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }

  return (
    <View
      style={{
        backgroundColor,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: theme.borderColor?.get(),
        backdropFilter: 'blur(20px)',
      }}
    />
  );
}
