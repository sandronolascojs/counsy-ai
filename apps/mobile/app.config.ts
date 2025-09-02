import { type ConfigContext, type ExpoConfig } from 'expo/config';

type AppEnvironment = 'development' | 'staging' | 'production';

const getAppEnvironment = (): AppEnvironment => {
  const env = (
    process.env.EXPO_PUBLIC_APP_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    'development'
  ).toLowerCase();
  if (env === 'production') return 'production';
  if (env === 'staging' || env === 'preview') return 'staging';
  return 'development';
};

const getSchemeForEnv = (env: AppEnvironment): string => {
  switch (env) {
    case 'production':
      return 'counsy-ai';
    case 'staging':
      return 'counsy-ai-staging';
    default:
      return 'counsy-ai-dev';
  }
};

const getBundleIdentifier = (env: AppEnvironment): string => {
  const base = 'com.counsy.app';
  if (env === 'production') return base;
  if (env === 'staging') return `${base}.staging`;
  return `${base}.dev`;
};

const getAndroidPackage = getBundleIdentifier;

const getDomainsForEnv = (env: AppEnvironment) => {
  const PROD = process.env.EXPO_PUBLIC_HOST_PROD || 'counsy.app';
  const STG = process.env.EXPO_PUBLIC_HOST_STG || 'staging.counsy.app';
  const DEV = process.env.EXPO_PUBLIC_HOST_DEV || 'dev.counsy.app';
  switch (env) {
    case 'production':
      return { host: PROD, associated: [PROD] };
    case 'staging':
      return { host: STG, associated: [STG] };
    default:
      return { host: DEV, associated: [DEV] };
  }
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = getAppEnvironment();
  const scheme = getSchemeForEnv(appEnv);
  const bundleId = getBundleIdentifier(appEnv);
  const androidPackage = getAndroidPackage(appEnv);
  const { host, associated } = getDomainsForEnv(appEnv);

  const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS;
  const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID;

  return {
    name: 'Counsy AI',
    slug: 'counsy-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    runtimeVersion: { policy: 'appVersion' },
    owner: 'counsy-ai',
    ios: {
      bundleIdentifier: bundleId,
      supportsTablet: true,
      usesAppleSignIn: true,
      associatedDomains: [
        ...associated.map((d) => `applinks:${d}`),
        ...associated.map((d) => `webcredentials:${d}`),
      ],
      infoPlist: {
        NSMicrophoneUsageDescription: 'We need your microphone to talk to the assistant.',
        NSSpeechRecognitionUsageDescription: 'To transcribe your voice in real time.',
        UIBackgroundModes: ['audio', 'remote-notification'],
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: androidPackage,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      allowBackup: false,
      intentFilters: [
        {
          autoVerify: true,
          action: 'VIEW',
          data: [{ scheme: 'https', host }],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      permissions: ['INTERNET', 'RECORD_AUDIO', 'POST_NOTIFICATIONS', 'FOREGROUND_SERVICE'],
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    plugins: [
      'expo-apple-authentication',
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
      [
        'expo-notifications',
        {
          icon: './assets/notifications/icon.png',
          mode: appEnv === 'production' ? 'production' : 'development',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            entitlements: {
              // Data Protection: Complete Protection (privacy-first)
              'com.apple.developer.default-data-protection': 'NSFileProtectionComplete',
            },
          },
          android: {},
        },
      ],
    ],

    experiments: { typedRoutes: true },

    extra: {
      ...config.extra,
      eas: {
        projectId: 'caf157a7-df51-446c-bf4d-bbe96b69d6c5',
      },
      appEnv,
      scheme,
      bundleId,
      host,
      revenuecat: {
        iosApiKey: RC_API_KEY_IOS,
        androidApiKey: RC_API_KEY_ANDROID,
      },
    },
  } satisfies ExpoConfig;
};
