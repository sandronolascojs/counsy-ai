import * as Colors from '@tamagui/colors';
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';

const darkPalette = [
  'hsla(0, 0%, 1%, 1)',
  'hsla(0, 0%, 6%, 1)',
  'hsla(0, 0%, 12%, 1)',
  'hsla(0, 0%, 17%, 1)',
  'hsla(0, 0%, 23%, 1)',
  'hsla(0, 0%, 28%, 1)',
  'hsla(0, 0%, 34%, 1)',
  'hsla(0, 0%, 39%, 1)',
  'hsla(0, 0%, 45%, 1)',
  'hsla(0, 0%, 50%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 99%, 1)',
];
const lightPalette = [
  'hsla(0, 0%, 92%, 1)',
  'hsla(0, 0%, 87%, 1)',
  'hsla(0, 0%, 83%, 1)',
  'hsla(0, 0%, 78%, 1)',
  'hsla(0, 0%, 73%, 1)',
  'hsla(0, 0%, 69%, 1)',
  'hsla(0, 0%, 64%, 1)',
  'hsla(0, 0%, 59%, 1)',
  'hsla(0, 0%, 55%, 1)',
  'hsla(0, 0%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 1%, 1)',
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
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
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

export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any);
