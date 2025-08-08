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
          height: '100%',
          width: '100%',
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
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
        borderTopWidth: theme.borderWidth?.get(),
        borderTopColor: theme.borderColor?.get(),
        height: '100%',
        width: '100%',
        backdropFilter: 'blur(20px)',
        pointerEvents: 'none',
      }}
    />
  );
}
