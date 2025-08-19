import { themes as customThemes } from '@/constants/themes';
import { createAnimations } from '@tamagui/animations-react-native';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export const config = createTamagui({
  ...defaultConfig,
  animations: createAnimations({
    fast: { damping: 20, mass: 1.2, stiffness: 250 },
    medium: { damping: 10, mass: 0.9, stiffness: 100 },
    slow: { damping: 10, mass: 0.9, stiffness: 100 },
    bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
    'fast-in': { damping: 20, mass: 1.2, stiffness: 250 },
    'medium-in': { damping: 10, mass: 0.9, stiffness: 100 },
    'slow-in': { damping: 10, mass: 0.9, stiffness: 100 },
    'bouncy-in': { damping: 10, mass: 0.9, stiffness: 100 },
    'fast-out': { damping: 20, mass: 1.2, stiffness: 250 },
    'medium-out': { damping: 10, mass: 0.9, stiffness: 100 },
    'slow-out': { damping: 10, mass: 0.9, stiffness: 100 },
    'bouncy-out': { damping: 10, mass: 0.9, stiffness: 100 },
  }),
  themes: {
    ...defaultConfig.themes,
    ...customThemes,
  },
  shorthands: {
    ...defaultConfig.shorthands,
  },
});

export default config;
export type AppTamaguiConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
