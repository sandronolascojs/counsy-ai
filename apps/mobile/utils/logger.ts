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

const safeStringify = (value: unknown): string => {
  try {
    const seen = new WeakSet<object>();
    return JSON.stringify(value, (_key, val) => {
      if (val instanceof Error) {
        return {
          name: val.name,
          message: val.message,
          stack: val.stack,
        };
      }
      if (typeof val === 'object' && val !== null) {
        const objectVal = val as object;
        if (seen.has(objectVal)) return '[Circular]';
        seen.add(objectVal);
      }
      return val;
    });
  } catch {
    try {
      return String(value);
    } catch {
      return '[Unserializable]';
    }
  }
};

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
    let output = '';
    try {
      output = JSON.stringify(payload);
    } catch {
      output = safeStringify(payload);
    }
    const method: 'error' | 'warn' | 'info' | 'debug' | 'log' =
      lvl === 'error'
        ? 'error'
        : lvl === 'warn'
          ? 'warn'
          : lvl === 'info'
            ? 'info'
            : lvl === 'debug'
              ? 'debug'
              : 'log';
    // eslint-disable-next-line no-console
    console[method](output);
  };

  return {
    info: (message: string, context?: MobileLogContext) => base('info', message, context),
    warn: (message: string, context?: MobileLogContext) => base('warn', message, context),
    error: (message: string, context?: MobileLogContext) => base('error', message, context),
    debug: (message: string, context?: MobileLogContext) => base('debug', message, context),
  };
};

export const mobileLogger = createMobileLogger({ serviceName: 'biometrics', level: 'info' });
