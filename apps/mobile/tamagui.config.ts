import { themes } from '@/constants/themes';
import { createAnimations } from '@tamagui/animations-react-native';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export default createTamagui({
  ...defaultConfig,
  animations: createAnimations({
    fast: {
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    slow: {
      damping: 20,
      stiffness: 60,
    },
    lazy: {
      damping: 20,
      stiffness: 60,
    },
    bouncy: {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    spring: {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    'fast-in': {
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    'fast-out': {
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    'medium-in': {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
    'medium-out': {
      damping: 10,
      mass: 0.9,
      stiffness: 100,
    },
  }),
  themes,
});
