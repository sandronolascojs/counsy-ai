import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform } from 'react-native';
import { View } from 'tamagui';

export function TabBarBackground() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <BlurView
        intensity={85}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 84,
          bottom: 0,
        }}
      />
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        backdropFilter: 'blur(20px)',
      }}
    />
  );
}
