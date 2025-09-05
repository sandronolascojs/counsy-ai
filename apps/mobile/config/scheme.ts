export type AppEnvironment = 'development' | 'staging' | 'production';

// Re-export typed wrappers around the JS single-source module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('./scheme.shared.js');

export const getAppEnvironmentFromProcess = (): AppEnvironment =>
  shared.getAppEnvironmentFromProcess();
export const getSchemeForEnv = (env: AppEnvironment): string => shared.getSchemeForEnv(env);
export const resolveRuntimeScheme = (envValue?: string | null): string =>
  shared.resolveRuntimeScheme(envValue);
