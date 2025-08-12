import { type ConfigContext, type ExpoConfig } from 'expo/config';

type AppEnvironment = 'development' | 'staging' | 'production';

const getAppEnvironment = (): AppEnvironment => {
  const envFromProcess = (
    process.env.EXPO_APP_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    'development'
  ).toLowerCase();
  if (envFromProcess === 'production') return 'production';
  if (envFromProcess === 'staging' || envFromProcess === 'preview') return 'staging';
  return 'development';
};

const getSchemeForEnv = (env: AppEnvironment): string => {
  switch (env) {
    case 'production':
      return 'counsy-ai';
    case 'staging':
      return 'counsy-ai-staging';
    case 'development':
    default:
      return 'counsy-ai-dev';
  }
};

const getBundleIdentifier = (env: AppEnvironment): string => {
  const base = 'com.counsy.ai';
  if (env === 'production') return base;
  if (env === 'staging') return `${base}.staging`;
  return `${base}.dev`;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = getAppEnvironment();
  const scheme = getSchemeForEnv(appEnv);
  const bundleId = getBundleIdentifier(appEnv);

  return {
    name: 'Counsy AI',
    slug: 'counsy-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    runtimeVersion: {
      policy: 'appVersion',
    },
    ios: {
      bundleIdentifier: bundleId,
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: bundleId,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      ...config.extra,
      appEnv,
      scheme,
      bundleId,
    },
  } satisfies ExpoConfig;
};
