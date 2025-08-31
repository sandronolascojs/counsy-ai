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
          disableExtraction: true,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
