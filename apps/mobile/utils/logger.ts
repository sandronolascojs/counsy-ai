export type MobileLogLevel = 'info' | 'warn' | 'error' | 'debug';

export type MobileLogContext = Record<string, unknown> & {
  userId?: string;
  screen?: string;
  event?: string;
};

export interface MobileLoggerOptions {
  serviceName?: string;
  level?: MobileLogLevel;
}

export const createMobileLogger = ({
  serviceName = 'mobile',
  level = 'info',
}: MobileLoggerOptions = {}) => {
  const shouldLog = (lvl: MobileLogLevel): boolean => {
    const order: Record<MobileLogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };
    return order[lvl] <= order[level];
  };

  const base = (lvl: MobileLogLevel, message: string, context?: MobileLogContext) => {
    if (!shouldLog(lvl)) return;
    const payload = {
      ts: new Date().toISOString(),
      service: serviceName,
      level: lvl,
      message,
      ...context,
    };
    // For now, console-based structured logs; can be wired to Sentry/Datadog later
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload));
  };

  return {
    info: (message: string, context?: MobileLogContext) => base('info', message, context),
    warn: (message: string, context?: MobileLogContext) => base('warn', message, context),
    error: (message: string, context?: MobileLogContext) => base('error', message, context),
    debug: (message: string, context?: MobileLogContext) => base('debug', message, context),
  };
};

export const mobileLogger = createMobileLogger({ serviceName: 'biometrics', level: 'info' });
