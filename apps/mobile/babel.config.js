// Default to 'native' if not provided; allow CI/CLI overrides (e.g., web builds)
process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'native';

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          config: './tamagui.config.ts',
          components: ['tamagui'],
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      ['transform-inline-environment-variables', { include: ['TAMAGUI_TARGET'] }],
      'react-native-reanimated/plugin',
    ],
  };
};
