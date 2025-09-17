import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ErrorCategory, ErrorContext, ErrorSeverity } from '../errors/errorTypes';
import { metrics } from '../monitoring/metrics';
import { logger } from '../utils/logger.instance';

export interface DLQMessage {
  originalMessageId: string;
  originalBody: string;
  originalAttributes: Record<string, unknown>;
  failureReason: string;
  errorDetails: {
    name: string;
    message: string;
    stack?: string;
    severity: ErrorSeverity;
    category: ErrorCategory;
  };
  retryCount: number;
  failedAt: string;
  context: ErrorContext;
}

export class DeadLetterQueueManager {
  private readonly sqsClient: SQSClient;
  private readonly dlqUrl: string;

  constructor(sqsClient: SQSClient, dlqUrl: string) {
    this.sqsClient = sqsClient;
    this.dlqUrl = dlqUrl;
  }

  async sendToDLQ(
    originalMessageId: string,
    originalBody: string,
    originalAttributes: Record<string, unknown>,
    error: Error,
    retryCount: number,
    context: ErrorContext,
    severity: ErrorSeverity,
    category: ErrorCategory,
  ): Promise<void> {
    try {
      const dlqMessage: DLQMessage = {
        originalMessageId,
        originalBody,
        originalAttributes,
        failureReason: this.generateFailureReason(error, retryCount),
        errorDetails: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          severity,
          category,
        },
        retryCount,
        failedAt: new Date().toISOString(),
        context,
      };

      const command = new SendMessageCommand({
        QueueUrl: this.dlqUrl,
        MessageBody: JSON.stringify(dlqMessage),
        MessageAttributes: {
          originalMessageId: {
            DataType: 'String',
            StringValue: originalMessageId,
          },
          failureReason: {
            DataType: 'String',
            StringValue: dlqMessage.failureReason,
          },
          severity: {
            DataType: 'String',
            StringValue: severity,
          },
          category: {
            DataType: 'String',
            StringValue: category,
          },
          retryCount: {
            DataType: 'Number',
            StringValue: retryCount.toString(),
          },
        },
      });

      await this.sqsClient.send(command);

      // Log DLQ action
      logger.error(`Message ${originalMessageId} sent to Dead Letter Queue`, {
        messageId: originalMessageId,
        template: context.template,
        userId: context.userId,
        service: 'notifications-service',
        operation: 'send-to-dlq',
        error: error,
        metadata: {
          retryCount,
          severity,
          category,
          failureReason: dlqMessage.failureReason,
        },
      });

      // Record metrics
      metrics.incrementCounter('messages_sent_to_dlq', 1, {
        severity,
        category,
        template: context.template || 'unknown',
      });
    } catch (dlqError) {
      // If we can't send to DLQ, log it as critical error
      logger.error(`Failed to send message ${originalMessageId} to Dead Letter Queue`, {
        messageId: originalMessageId,
        service: 'notifications-service',
        operation: 'send-to-dlq-failed',
        error: dlqError as Error,
        metadata: {
          originalError: error.message,
          dlqError: (dlqError as Error).message,
          severity: 'critical',
          category: 'internal',
        },
      });

      // Record critical failure
      metrics.incrementCounter('dlq_send_failures', 1, {
        severity: 'critical',
        category: 'internal',
      });
    }
  }

  private generateFailureReason(error: Error, retryCount: number): string {
    const baseReason = `${error.name}: ${error.message}`;

    if (retryCount > 0) {
      return `${baseReason} (after ${retryCount} retries)`;
    }

    return baseReason;
  }

  // Health check for DLQ
  async isHealthy(): Promise<boolean> {
    try {
      // Try to send a test message to verify DLQ is accessible
      const testCommand = new SendMessageCommand({
        QueueUrl: this.dlqUrl,
        MessageBody: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
        MessageAttributes: {
          test: {
            DataType: 'String',
            StringValue: 'true',
          },
        },
      });

      await this.sqsClient.send(testCommand);
      return true;
    } catch (error) {
      logger.error('DLQ health check failed', {
        service: 'notifications-service',
        operation: 'dlq-health-check',
        error: error as Error,
      });
      return false;
    }
  }
}
