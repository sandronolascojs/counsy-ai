import * as Colors from '@tamagui/colors';
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';

const colors = {
  light: {
    background: 'hsla(0, 0%, 100%, 1)',
    backgroundSecondary: 'hsla(0, 0%, 96%, 1)',
    backgroundTertiary: 'hsla(0, 0%, 92%, 1)',
    backgroundHover: 'hsla(0, 0%, 90%, 1)',
    backgroundPress: 'hsla(0, 0%, 88%, 1)',
    text: 'hsla(0, 0%, 10%, 1)',
    textSecondary: 'hsla(0, 0%, 30%, 1)',
    border: 'hsla(0, 0%, 85%, 1)',
  },
  dark: {
    background: 'hsla(0, 0%, 6%, 1)',
    backgroundSecondary: 'hsla(0, 0%, 10%, 1)',
    backgroundTertiary: 'hsla(0, 0%, 15%, 1)',
    backgroundHover: 'hsla(0, 0%, 20%, 1)',
    backgroundPress: 'hsla(0, 0%, 25%, 1)',
    text: 'hsla(0, 0%, 95%, 1)',
    textSecondary: 'hsla(0, 0%, 70%, 1)',
    border: 'hsla(0, 0%, 30%, 1)',
  },
} as const;

const darkPalette = [
  colors.dark.background,
  colors.dark.backgroundSecondary,
  colors.dark.backgroundTertiary,
  colors.dark.backgroundHover,
  colors.dark.backgroundPress,
  'hsla(0, 0%, 28%, 1)',
  'hsla(0, 0%, 34%, 1)',
  'hsla(0, 0%, 39%, 1)',
  'hsla(0, 0%, 45%, 1)',
  'hsla(0, 0%, 50%, 1)',
  colors.dark.textSecondary,
  colors.dark.text,
];

const lightPalette = [
  colors.light.background,
  colors.light.backgroundSecondary,
  colors.light.backgroundTertiary,
  colors.light.backgroundHover,
  colors.light.backgroundPress,
  'hsla(0, 0%, 69%, 1)',
  'hsla(0, 0%, 64%, 1)',
  'hsla(0, 0%, 59%, 1)',
  'hsla(0, 0%, 55%, 1)',
  'hsla(0, 0%, 50%, 1)',
  colors.light.textSecondary,
  colors.light.text,
];

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
};

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
};

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },
    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        borderColor: colors.light.border,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        borderColor: colors.dark.border,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: [
        'hsla(269, 85%, 35%, 1)',
        'hsla(269, 85%, 38%, 1)',
        'hsla(269, 85%, 41%, 1)',
        'hsla(269, 85%, 43%, 1)',
        'hsla(269, 85%, 46%, 1)',
        'hsla(269, 85%, 49%, 1)',
        'hsla(269, 85%, 52%, 1)',
        'hsla(269, 85%, 54%, 1)',
        'hsla(269, 85%, 57%, 1)',
        'hsla(269, 85%, 60%, 1)',
        'hsla(250, 50%, 90%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
      light: [
        'hsla(269, 85%, 61%, 1)',
        'hsla(269, 85%, 61%, 1)',
        'hsla(269, 85%, 62%, 1)',
        'hsla(269, 85%, 62%, 1)',
        'hsla(269, 85%, 63%, 1)',
        'hsla(269, 85%, 63%, 1)',
        'hsla(269, 85%, 64%, 1)',
        'hsla(269, 85%, 64%, 1)',
        'hsla(269, 85%, 65%, 1)',
        'hsla(269, 85%, 65%, 1)',
        'hsla(250, 50%, 95%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
    },
  },
  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },
    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },
    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },
});

export type Themes = typeof builtThemes;
export type ThemeName = keyof Themes;

// Always export full themes so tokens/theme variables are available in all environments
export const themes: Themes = builtThemes;
