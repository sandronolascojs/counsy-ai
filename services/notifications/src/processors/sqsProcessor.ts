import { env } from '@/config/env.config';
import type { SqsEvent } from '@/types';
import type { MessageAttributeValue } from '@aws-sdk/client-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { db } from '@counsy-ai/db';
import { EmailService, normalizeTransporterType } from '@counsy-ai/shared';
import { NotificationTransporterType } from '@counsy-ai/types';
import { DeadLetterQueueManager } from '../dlq/deadLetterQueue';
import { ErrorClassifier } from '../errors/errorClassifier';
import { metrics } from '../monitoring/metrics';
import { parseEmailPayload, renderEmail } from '../notifications';
import { NotificationsUserRepository } from '../repositories/user.repository';
import { RetryManager } from '../retry/retryManager';
import { NotificationsUserService } from '../services/notificationsUser.service';
import { logger } from '../utils/logger.instance';

const ses = new EmailService({
  fromEmail: env.FROM_EMAIL,
  region: env.AWS_REGION,
  configurationSetName: env.APP_ENV === 'development' ? undefined : env.SES_CONFIGURATION_SET,
});

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

  // First try to get attributes from SQS messageAttributes (direct SQS messages)
  if (message.messageAttributes) {
    for (const [key, value] of Object.entries(message.messageAttributes)) {
      if (value.StringValue) {
        attrs[key] = value.StringValue;
      }
    }
  }

  // If no attributes found, try to extract from SNS message content
  if (Object.keys(attrs).length === 0) {
    try {
      const snsMessage = JSON.parse(message.body) as Record<string, unknown>;
      if (snsMessage.MessageAttributes && typeof snsMessage.MessageAttributes === 'object') {
        const messageAttributes = snsMessage.MessageAttributes as Record<string, unknown>;
        for (const [key, value] of Object.entries(messageAttributes)) {
          if (value && typeof value === 'object' && 'Value' in value) {
            const attrValue = value as { Value: unknown };
            if (typeof attrValue.Value === 'string') {
              attrs[key] = attrValue.Value;
            }
          }
        }
      }
    } catch {
      // If parsing fails, continue with empty attrs
    }
  }

  const context = {
    messageId,
    userId: attrs.userId,
    template: attrs.template,
    retryCount,
    timestamp: new Date(),
    metadata: {
      originalMessageId: attrs.messageId,
      queue: attrs.queue,
    },
  };

  logger.info('Processing SQS message', {
    messageId,
    userId: attrs.userId,
    template: attrs.template,
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

    if (transporter === NotificationTransporterType.MAIL) {
      return await processEmailMessage(payload, attrs, context, startTime);
    }

    // Future: support NotificationTransporterType.EXPO here
    logger.info('Non-MAIL transporter ignored', {
      messageId,
      transporter,
      userId: attrs.userId,
    });

    return { success: true };
  } catch (error) {
    const duration = Date.now() - startTime;
    const classifiedError = ErrorClassifier.classify(error as Error, context);

    logger.error('Message processing failed', {
      messageId,
      userId: attrs.userId,
      template: attrs.template,
      retryCount,
      duration,
      error: error as Error,
      errorCategory: classifiedError.category,
      errorSeverity: classifiedError.severity,
    });

    // Record metrics
    metrics.recordMessageProcessed(attrs.template || 'unknown', false, duration);

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

const notificationsUserService = new NotificationsUserService(
  new NotificationsUserRepository(db, logger),
  logger,
  db,
);

async function processEmailMessage(
  payload: unknown,
  attrs: Record<string, string>,
  context: {
    messageId: string;
    userId?: string;
    template?: string;
    retryCount: number;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  },
  startTime: number,
): Promise<ProcessedMessage> {
  const emailStartTime = Date.now();

  try {
    if (!attrs.userId) {
      throw new Error('User ID is required');
    }
    const emailMsg = parseEmailPayload(payload);
    const locale = await notificationsUserService.getUserLocale({ userId: attrs.userId });
    if (!locale) {
      throw new Error('Locale is required');
    }
    const html = await renderEmail(emailMsg, locale);

    // Use retry mechanism for email sending
    const classifiedError = ErrorClassifier.classify(new Error('placeholder'), context);

    await RetryManager.executeWithRetry(async () => {
      await ses.sendEmail({
        to: emailMsg.to,
        subject: emailMsg.subject,
        html,
      });
    }, classifiedError);

    const duration = Date.now() - startTime;
    const emailDuration = Date.now() - emailStartTime;

    logger.info('Email sent successfully', {
      messageId: context.messageId,
      userId: attrs.userId,
      template: attrs.template,
      to: emailMsg.to,
      duration: emailDuration,
    });

    // Record metrics
    metrics.recordMessageProcessed(attrs.template || 'unknown', true, duration);
    metrics.recordEmailSent(attrs.template || 'unknown', true, emailDuration);

    return { success: true };
  } catch (error) {
    const emailDuration = Date.now() - emailStartTime;

    logger.error('Email sending failed', {
      messageId: context.messageId,
      userId: attrs.userId,
      template: attrs.template,
      duration: emailDuration,
      error: error as Error,
    });

    // Record metrics
    metrics.recordEmailSent(attrs.template || 'unknown', false, emailDuration);

    throw error;
  }
}

export async function processSqsEvent(event: SqsEvent): Promise<void> {
  for (const record of event.Records) {
    const result = await processSqsMessage({
      body: record.body,
      messageAttributes: record.messageAttributes as unknown as Record<
        string,
        MessageAttributeValue
      >,
    });

    if (!result.success) {
      // Rethrow to enable SQS retry / DLQ
      throw new Error(result.error?.message || 'Message processing failed');
    }
  }
}

function decodeSqsBody(body: string): { payload: unknown } {
  const outer = tryParse(body);
  if (isObject(outer) && typeof outer.Message === 'string') {
    const inner = tryParse(outer.Message);
    return { payload: inner };
  }
  return { payload: outer };
}

function tryParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
