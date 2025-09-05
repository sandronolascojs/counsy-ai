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
          // Disable Tamagui extraction during development or when explicitly opted out.
          // Boolean: true disables extraction, false enables it (production default).
          // To force-disable extraction, set TAMAGUI_DISABLE_EXTRACTION='true'.
          disableExtraction:
            process.env.TAMAGUI_DISABLE_EXTRACTION === 'true' ||
            process.env.NODE_ENV !== 'production',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
