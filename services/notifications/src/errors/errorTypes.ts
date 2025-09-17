export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  CONFIGURATION = 'configuration',
  EXTERNAL_SERVICE = 'external_service',
  INTERNAL = 'internal',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  messageId?: string;
  userId?: string;
  template?: string;
  retryCount?: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ClassifiedError {
  error: Error;
  severity: ErrorSeverity;
  category: ErrorCategory;
  isRetryable: boolean;
  maxRetries: number;
  context: ErrorContext;
}

export class NotificationError extends Error {
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly isRetryable: boolean;
  public readonly maxRetries: number;
  public readonly context: ErrorContext;

  constructor(
    message: string,
    severity: ErrorSeverity,
    category: ErrorCategory,
    isRetryable = false,
    maxRetries = 3,
    context: ErrorContext,
    cause?: Error,
  ) {
    super(message);
    this.name = 'NotificationError';
    this.severity = severity;
    this.category = category;
    this.isRetryable = isRetryable;
    this.maxRetries = maxRetries;
    this.context = context;

    if (cause) {
      this.cause = cause;
    }
  }
}
