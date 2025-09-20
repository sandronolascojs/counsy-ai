import type { SqsEvent } from '@/types';
import type { MessageAttributeValue } from '@aws-sdk/client-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { NotificationQueuePayload, NotificationQueuePayloadSchema } from '@counsy-ai/types';
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

  // Extract attributes from SQS message attributes first (preferred with RawMessageDelivery)
  // If missing, attempt to extract from SNS envelope inside SQS body
  const attrs: Record<string, string> = {};
  if (message.messageAttributes) {
    Object.entries(message.messageAttributes).forEach(([key, value]) => {
      if (typeof value.StringValue === 'string') {
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
    // Decode message body and optionally recover attributes from SNS envelope
    const { payload, envelopeAttributes, rawDelivery, envelopeDetected, originalBodySize } =
      decodeSqsBody(message.body);

    // Merge attributes from envelope if SQS attributes were empty
    if (!attrs.queue && envelopeAttributes) {
      Object.assign(attrs, envelopeAttributes);
      context.userId = attrs.userId;
      context.queue = attrs.queue;
      context.eventType = attrs.eventType;
      context.eventVersion = attrs.eventVersion;
      context.source = attrs.source;
      context.correlationId = attrs.correlationId;
      context.requestId = attrs.requestId;
    }

    // Determine transporter and validate strictly; if invalid, ignore and log
    const notificationPayload = validateNotificationPayload(payload);
    if (!notificationPayload) {
      logger.warn('Ignored non-conformant notification payload', {
        messageId,
        userId: attrs.userId,
        queue: attrs.queue,
        eventType: attrs.eventType,
        correlationId: attrs.correlationId,
        requestId: attrs.requestId,
        bodyPreview: safePreview(message.body),
        hasSqsAttributes: !!message.messageAttributes,
      });
      // Treat as successfully handled to avoid retries
      return { success: true };
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
        rawDelivery,
        envelopeDetected,
        originalBodySize,
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
      bodyPreview: safePreview(message.body),
      hasSqsAttributes: !!message.messageAttributes,
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
type DecodedBody = {
  payload: unknown;
  envelopeAttributes?: Record<string, string>;
  rawDelivery: boolean;
  envelopeDetected: boolean;
  originalBodySize: number;
};

function decodeSqsBody(body: string): DecodedBody {
  const originalBodySize = body.length;
  try {
    const parsed: unknown = JSON.parse(body);

    // Case 1: RawMessageDelivery (SNS -> SQS) where producer already sends final payload shape
    if (isRecord(parsed) && 'payload' in parsed) {
      return {
        payload: (parsed as { payload: unknown }).payload,
        rawDelivery: true,
        envelopeDetected: false,
        originalBodySize,
      };
    }

    // Case 2: SNS envelope present (common when RawMessageDelivery is disabled)
    // SNS structure typically contains: Type, Message, MessageAttributes, etc.
    if (isRecord(parsed) && typeof parsed.Message !== 'undefined') {
      let innerPayload: unknown = parsed.Message as unknown;
      try {
        if (typeof parsed.Message === 'string') {
          innerPayload = JSON.parse(parsed.Message);
        }
      } catch {
        // keep as string if not JSON
      }

      const envelopeAttributes: Record<string, string> = {};
      if (isRecord(parsed.MessageAttributes)) {
        for (const [key, val] of Object.entries(parsed.MessageAttributes)) {
          if (isRecord(val) && typeof val.Value === 'string') {
            envelopeAttributes[key] = val.Value;
          }
        }
      }

      // If message is of shape { payload: ... } inside SNS Message, unwrap
      if (isRecord(innerPayload) && 'payload' in innerPayload) {
        return {
          payload: (innerPayload as { payload: unknown }).payload,
          envelopeAttributes,
          rawDelivery: false,
          envelopeDetected: true,
          originalBodySize,
        };
      }

      // Otherwise, treat inner payload as the payload directly
      return {
        payload: innerPayload,
        envelopeAttributes,
        rawDelivery: false,
        envelopeDetected: true,
        originalBodySize,
      };
    }

    // Fallback: if it's an object but not matching expected shapes
    return {
      payload: parsed,
      rawDelivery: true,
      envelopeDetected: false,
      originalBodySize,
    };
  } catch (error) {
    throw new Error(
      `Failed to decode SQS message body: ${String(error)} | bodyPreview=${safePreview(body)}`,
    );
  }
}

// normalizeTransporterType removed; strict payload validation is the only source of truth now

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

function safePreview(body: string, max = 500): string {
  if (!body) return '';
  return body.length > max ? `${body.slice(0, max)}...[truncated ${body.length - max}]` : body;
}

type StringRecord = Record<string, unknown>;

function isRecord(value: unknown): value is StringRecord {
  return typeof value === 'object' && value !== null;
}

// legacy coercion removed by product decision; non-conformant payloads are ignored and logged
