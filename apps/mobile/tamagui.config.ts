import { themes } from '@/constants/themes';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

export default createTamagui({
  ...defaultConfig,
  themes,
});
