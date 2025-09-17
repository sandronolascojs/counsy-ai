import { ClassifiedError, ErrorCategory, ErrorContext, ErrorSeverity } from './errorTypes';

export const ErrorClassifier = {
  classify(error: Error, context: ErrorContext): ClassifiedError {
    // AWS SDK errors
    if (error.name.includes('AWS')) {
      return ErrorClassifier.classifyAWSError(error, context);
    }

    // Network errors
    if (ErrorClassifier.isNetworkError(error)) {
      return {
        error,
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.NETWORK,
        isRetryable: true,
        maxRetries: 5,
        context,
      };
    }

    // Validation errors
    if (ErrorClassifier.isValidationError(error)) {
      return {
        error,
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        isRetryable: false,
        maxRetries: 0,
        context,
      };
    }

    // Rate limit errors
    if (ErrorClassifier.isRateLimitError(error)) {
      return {
        error,
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.RATE_LIMIT,
        isRetryable: true,
        maxRetries: 3,
        context,
      };
    }

    // Authentication errors
    if (ErrorClassifier.isAuthenticationError(error)) {
      return {
        error,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.AUTHENTICATION,
        isRetryable: false,
        maxRetries: 0,
        context,
      };
    }

    // Generic error
    return ErrorClassifier.classifyGenericError(error, context);
  },

  classifyAWSError(error: Error, context: ErrorContext): ClassifiedError {
    // AWS SES errors
    if (error.name.includes('SES')) {
      return {
        error,
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.EXTERNAL_SERVICE,
        isRetryable: true,
        maxRetries: 3,
        context,
      };
    }

    // AWS SQS errors
    if (error.name.includes('SQS')) {
      return {
        error,
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.EXTERNAL_SERVICE,
        isRetryable: true,
        maxRetries: 5,
        context,
      };
    }

    // Generic AWS error
    return {
      error,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.EXTERNAL_SERVICE,
      isRetryable: true,
      maxRetries: 3,
      context,
    };
  },

  classifyNetworkError(error: Error, context: ErrorContext): ClassifiedError {
    return {
      error,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.NETWORK,
      isRetryable: true,
      maxRetries: 5,
      context,
    };
  },

  classifyValidationError(error: Error, context: ErrorContext): ClassifiedError {
    return {
      error,
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      isRetryable: false,
      maxRetries: 0,
      context,
    };
  },

  classifyRateLimitError(error: Error, context: ErrorContext): ClassifiedError {
    return {
      error,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.RATE_LIMIT,
      isRetryable: true,
      maxRetries: 3,
      context,
    };
  },

  classifyAuthenticationError(error: Error, context: ErrorContext): ClassifiedError {
    return {
      error,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.AUTHENTICATION,
      isRetryable: false,
      maxRetries: 0,
      context,
    };
  },

  classifyGenericError(error: Error, context: ErrorContext): ClassifiedError {
    return {
      error,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.UNKNOWN,
      isRetryable: true,
      maxRetries: 3,
      context,
    };
  },

  isNetworkError(error: Error): boolean {
    return (
      error.name.includes('Network') ||
      error.name.includes('Timeout') ||
      error.name.includes('ECONNREFUSED') ||
      error.name.includes('EHOSTUNREACH')
    );
  },

  isValidationError(error: Error): boolean {
    return (
      error.name.includes('Validation') ||
      error.name.includes('Invalid') ||
      error.message.includes('validation')
    );
  },

  isRateLimitError(error: Error): boolean {
    return (
      error.name.includes('RateLimit') ||
      error.name.includes('Throttle') ||
      error.message.includes('rate limit')
    );
  },

  isAuthenticationError(error: Error): boolean {
    return (
      error.name.includes('Auth') ||
      error.name.includes('Unauthorized') ||
      error.message.includes('authentication')
    );
  },
};
