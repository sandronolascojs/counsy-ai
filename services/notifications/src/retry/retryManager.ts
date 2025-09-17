import { ErrorClassifier } from '../errors/errorClassifier';
import { ClassifiedError, ErrorSeverity } from '../errors/errorTypes';
import { logger } from '../utils/logger.instance';

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  factor: number;
  jitter: number; // 0-1, percentage of jitter to apply
}

export interface RetryContext {
  attempt: number;
  maxRetries: number;
  delayMs: number;
  nextRetryAt?: Date;
}

export const RetryManager = {
  DEFAULT_RETRY_CONFIG: {
    maxRetries: 3,
    baseDelayMs: 1000, // 1 second
    maxDelayMs: 30000, // 30 seconds
    factor: 2,
    jitter: 0.1, // 10% jitter
  } as RetryConfig,

  async executeWithRetry<T>(
    fn: () => Promise<T>,
    classifiedError: ClassifiedError,
    config?: Partial<RetryConfig>,
  ): Promise<T> {
    const retryConfig = { ...RetryManager.DEFAULT_RETRY_CONFIG, ...config };
    const { maxRetries, baseDelayMs, maxDelayMs, factor, jitter } = retryConfig;

    if (!classifiedError.isRetryable) {
      throw classifiedError.error; // Not retryable, rethrow immediately
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const currentError = error as Error;
        const currentClassifiedError = ErrorClassifier.classify(
          currentError,
          classifiedError.context,
        );

        // If the error is no longer retryable, or its severity/category changed to non-retryable, rethrow
        if (
          !currentClassifiedError.isRetryable ||
          currentClassifiedError.severity === ErrorSeverity.CRITICAL
        ) {
          logger.error('Error became non-retryable or critical during retry attempts', {
            messageId: classifiedError.context.messageId,
            userId: classifiedError.context.userId,
            template: classifiedError.context.template,
            attempt,
            error: currentError,
            errorCategory: currentClassifiedError.category,
            errorSeverity: currentClassifiedError.severity,
          });
          throw currentError;
        }

        if (attempt < maxRetries) {
          const delay = RetryManager.calculateDelay(
            baseDelayMs,
            factor,
            attempt,
            maxDelayMs,
            jitter,
          );
          const nextRetryAt = new Date(Date.now() + delay);

          RetryManager.logRetryAttempt(
            currentClassifiedError,
            { attempt, maxRetries, delayMs: delay, nextRetryAt },
            delay,
          );
          await RetryManager.sleep(delay);
        } else {
          // Max retries exhausted
          logger.error('Max retries exhausted for operation', {
            messageId: classifiedError.context.messageId,
            userId: classifiedError.context.userId,
            template: classifiedError.context.template,
            attempt,
            maxRetries,
            error: currentError,
            errorCategory: currentClassifiedError.category,
            errorSeverity: currentClassifiedError.severity,
          });
          throw RetryManager.createRetryExhaustedError(currentClassifiedError, {
            attempt,
            maxRetries,
            delayMs: 0,
          });
        }
      }
    }
    throw new Error('Should not reach here'); // Fallback, should always throw or return
  },

  calculateDelay(
    baseDelay: number,
    factor: number,
    attempt: number,
    maxDelay: number,
    jitter: number,
  ): number {
    let delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
    const jitterAmount = Math.random() * jitter * delay;
    delay = Math.round(delay + jitterAmount);
    return delay;
  },

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  logRetryAttempt(classifiedError: ClassifiedError, context: RetryContext, delayMs: number): void {
    const { error, severity, category, context: errorContext } = classifiedError;
    const { attempt, maxRetries, nextRetryAt } = context;

    const logContext = {
      messageId: errorContext.messageId,
      userId: errorContext.userId,
      template: errorContext.template,
      retryAttempt: attempt,
      maxRetries,
      errorCategory: category,
      errorSeverity: severity,
      delayMs,
      nextRetryAt: nextRetryAt?.toISOString(),
    };

    const message = `Retry attempt ${attempt}/${maxRetries} for ${category} error (${severity}): ${error.message}`;

    switch (severity) {
      case ErrorSeverity.LOW:
      case ErrorSeverity.MEDIUM:
        logger.warn(message, logContext);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        logger.error(message, logContext);
        break;
      default:
        logger.warn(message, logContext);
    }
  },

  createRetryExhaustedError(classifiedError: ClassifiedError, _context: RetryContext): Error {
    const { error, context: errorContext } = classifiedError;
    return new Error(
      `Max retries exhausted for message ${errorContext.messageId}. Original error: ${error.message}`,
    );
  },
};
