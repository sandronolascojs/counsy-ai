import type { SqsEvent } from '@/types';
import type { MessageAttributeValue } from '@aws-sdk/client-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import {
  NotificationQueuePayload,
  NotificationQueuePayloadSchema,
  NotificationTransporterType,
} from '@counsy-ai/types';
import { DeadLetterQueueManager } from '../dlq/deadLetterQueue';
import { ErrorClassifier } from '../errors/errorClassifier';
import { NotificationDispatcher } from '../handlers';
import { metrics } from '../monitoring/metrics';
import { logger } from '../utils/logger.instance';

// Initialize DLQ manager (will be set up in server.ts)
let dlqManager: DeadLetterQueueManager | null = null;

export interface SqsMessage {
  body: string;
  messageAttributes?: Record<string, MessageAttributeValue>;
}

export interface ProcessedMessage {
  success: boolean;
  error?: Error;
  retryCount?: number;
  shouldRetry?: boolean;
}

export function initializeDLQ(sqsClient: SQSClient, dlqUrl: string): void {
  dlqManager = new DeadLetterQueueManager(sqsClient, dlqUrl);
}

export async function processSqsMessage(
  message: SqsMessage,
  retryCount = 0,
): Promise<ProcessedMessage> {
  const startTime = Date.now();
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  // Extract attributes from SNS message content (when coming from SNS → SQS)
  const attrs: Record<string, string> = {};
  if (message.messageAttributes) {
    Object.entries(message.messageAttributes).forEach(([key, value]) => {
      if (value.StringValue) {
        attrs[key] = value.StringValue;
      }
    });
  }

  const context = {
    messageId,
    userId: attrs.userId,
    queue: attrs.queue,
    eventType: attrs.eventType,
    eventVersion: attrs.eventVersion,
    source: attrs.source,
    correlationId: attrs.correlationId,
    requestId: attrs.requestId,
    retryCount,
    timestamp: new Date(),
  };

  logger.info('Processing notification message', {
    messageId,
    userId: attrs.userId,
    queue: attrs.queue,
    eventType: attrs.eventType,
    correlationId: attrs.correlationId,
    retryCount,
  });

  try {
    // Decode message body
    const { payload } = decodeSqsBody(message.body);

    // Validate message attributes
    if (!attrs.queue) {
      throw new Error('Missing queue attribute in message attributes');
    }

    const transporter = normalizeTransporterType(attrs.queue);

    // Only process notification queue messages
    if (
      transporter !== NotificationTransporterType.MAIL &&
      transporter !== NotificationTransporterType.EXPO
    ) {
      logger.info('Non-notification transporter ignored', {
        messageId,
        transporter,
        userId: attrs.userId,
        queue: attrs.queue,
        eventType: attrs.eventType,
        correlationId: attrs.correlationId,
        requestId: attrs.requestId,
      });
      return { success: true };
    }

    // Validate payload structure
    const notificationPayload = validateNotificationPayload(payload);
    if (!notificationPayload) {
      throw new Error('Invalid notification payload structure');
    }

    // Initialize notification dispatcher
    const dispatcher = new NotificationDispatcher(logger);

    // Dispatch notification
    const result = await dispatcher.dispatch(notificationPayload);

    const duration = Date.now() - startTime;

    if (result.success) {
      logger.info('Notification processed successfully', {
        messageId,
        userId: attrs.userId,
        notificationType: notificationPayload.notificationType,
        transporterType: notificationPayload.transporterType,
        duration,
        resultMessageId: result.messageId,
        queue: attrs.queue,
        eventType: attrs.eventType,
        correlationId: attrs.correlationId,
        requestId: attrs.requestId,
      });

      // Record metrics
      metrics.recordMessageProcessed(
        `${notificationPayload.notificationType}-${notificationPayload.transporterType}`,
        true,
        duration,
      );

      return { success: true };
    } else {
      throw result.error || new Error('Notification dispatch failed');
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const classifiedError = ErrorClassifier.classify(error as Error, context);

    logger.error('Notification processing failed', {
      messageId,
      userId: attrs.userId,
      retryCount,
      duration,
      error: error as Error,
      errorCategory: classifiedError.category,
      errorSeverity: classifiedError.severity,
      queue: attrs.queue,
      eventType: attrs.eventType,
      correlationId: attrs.correlationId,
      requestId: attrs.requestId,
    });

    // Record metrics
    metrics.recordMessageProcessed('notification', false, duration);

    // Handle retry logic
    if (classifiedError.isRetryable && retryCount < classifiedError.maxRetries) {
      return {
        success: false,
        error: error as Error,
        retryCount,
        shouldRetry: true,
      };
    }

    // Send to DLQ if retries exhausted
    if (dlqManager && retryCount >= classifiedError.maxRetries) {
      await dlqManager.sendToDLQ(
        messageId,
        message.body,
        message.messageAttributes || {},
        error as Error,
        retryCount,
        context,
        classifiedError.severity,
        classifiedError.category,
      );
    }

    return {
      success: false,
      error: error as Error,
      retryCount,
      shouldRetry: false,
    };
  }
}

export async function processSqsEvent(event: SqsEvent): Promise<void> {
  const results: ProcessedMessage[] = [];

  for (const record of event.Records) {
    const message: SqsMessage = {
      body: record.body,
      messageAttributes: record.messageAttributes as
        | Record<string, MessageAttributeValue>
        | undefined,
    };

    const result = await processSqsMessage(message);
    results.push(result);
  }

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  logger.info('SQS event processing completed', {
    totalMessages: results.length,
    successCount,
    failureCount,
  });
}

// Helper functions
function decodeSqsBody(body: string): { payload: unknown } {
  try {
    return JSON.parse(body) as { payload: unknown };
  } catch (error) {
    throw new Error(`Failed to decode SQS message body: ${error}`);
  }
}

function normalizeTransporterType(queue: string): NotificationTransporterType {
  switch (queue.toLowerCase()) {
    case 'mail':
    case 'email':
      return NotificationTransporterType.MAIL;
    case 'expo':
    case 'push':
      return NotificationTransporterType.EXPO;
    case 'sms':
      return NotificationTransporterType.SMS;
    case 'in_app':
    case 'inapp':
      return NotificationTransporterType.IN_APP;
    default:
      throw new Error(`Unknown transporter type: ${queue}`);
  }
}

function validateNotificationPayload(payload: unknown): NotificationQueuePayload | null {
  try {
    const result = NotificationQueuePayloadSchema.safeParse(payload);

    if (result.success) {
      return result.data;
    }

    logger.warn('Invalid notification payload', {
      errors: result.error.errors,
      payload: safeStringify(payload),
    });

    return null;
  } catch (error) {
    logger.error('Error validating notification payload', {
      error: error instanceof Error ? error.message : String(error),
      payload: safeStringify(payload),
    });
    return null;
  }
}

function safeStringify(value: unknown): string {
  try {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  } catch {
    return '[Unable to stringify]';
  }
}
