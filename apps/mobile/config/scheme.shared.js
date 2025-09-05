/**
 * Single source of truth for app environment and URL scheme mapping.
 * Plain JS so it works in Node (EAS config) and runtime bundlers.
 */

function getAppEnvironmentFromProcess() {
  const env = (
    process.env.EXPO_PUBLIC_APP_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    'development'
  ).toLowerCase();
  if (env === 'production') return 'production';
  if (env === 'staging' || env === 'preview') return 'staging';
  return 'development';
}

function getSchemeForEnv(env) {
  switch (env) {
    case 'production':
      return 'counsy-ai';
    case 'staging':
      return 'counsy-ai-staging';
    default:
      return 'counsy-ai-dev';
  }
}

function resolveRuntimeScheme(envValue) {
  const appEnv = (envValue || 'development').toLowerCase();
  if (appEnv === 'production') return 'counsy-ai';
  if (appEnv === 'staging' || appEnv === 'preview') return 'counsy-ai-staging';
  return 'counsy-ai-dev';
}

module.exports = {
  getAppEnvironmentFromProcess,
  getSchemeForEnv,
  resolveRuntimeScheme,
};
