import { env } from '@/config/env.config';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  type MessageAttributeValue,
} from '@aws-sdk/client-sqs';
import { metrics } from './monitoring/metrics';
import { initializeDLQ, processSqsMessage } from './processors/notificationProcessor';
import { logger } from './utils/logger.instance';

const sqsClient = new SQSClient({
  region: env.AWS_REGION,
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// SQS Queue URL - you'll need to set this in your environment
// For LocalStack: Get queue URL with: aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name your-queue-name
// Example: http://localhost:4566/000000000000/your-queue-name
const QUEUE_URL = process.env.SQS_QUEUE_URL || '';

export async function startLocalServer() {
  logger.info('Starting notifications service in local mode - polling SQS');

  if (!QUEUE_URL) {
    logger.error('SQS_QUEUE_URL environment variable is required for local development');
    process.exit(1);
  }

  // Initialize DLQ (optional for local development)
  const dlqUrl = process.env.DLQ_URL;
  if (dlqUrl) {
    initializeDLQ(sqsClient, dlqUrl);
    logger.info('Dead Letter Queue initialized', { dlqUrl });
  }

  logger.info('Polling SQS queue', { queueUrl: QUEUE_URL });

  // Poll SQS continuously
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const pollStartTime = Date.now();

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10, // Poll every 10 seconds
        MessageAttributeNames: ['All'],
      });

      const response = await sqsClient.send(command);
      const pollDuration = Date.now() - pollStartTime;

      if (response.Messages && response.Messages.length > 0) {
        logger.info('Received messages from SQS', {
          messageCount: response.Messages.length,
          pollDuration,
        });

        // Record SQS metrics
        metrics.recordSqsOperation('receive', true, response.Messages.length);

        // Process each message
        for (const message of response.Messages) {
          if (message.Body && message.ReceiptHandle) {
            await processMessage(message);
          }
        }
      } else {
        logger.debug('No messages received, continuing to poll', { pollDuration });
        metrics.recordSqsOperation('poll', true);
      }
    } catch (error) {
      const pollDuration = Date.now() - pollStartTime;

      logger.error('Error polling SQS', {
        error: error as Error,
        pollDuration,
      });

      // Record SQS error metrics
      metrics.recordSqsOperation('poll', false);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

interface SqsMessage {
  Body?: string;
  MessageAttributes?: Record<string, unknown>;
  ReceiptHandle?: string;
}

async function processMessage(message: SqsMessage): Promise<void> {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  try {
    logger.debug('Processing message', {
      messageId,
      hasBody: !!message.Body,
      hasAttributes: !!message.MessageAttributes,
      attributeCount: message.MessageAttributes ? Object.keys(message.MessageAttributes).length : 0,
    });

    const result = await processSqsMessage({
      body: message.Body || '',
      messageAttributes: message.MessageAttributes as Record<string, MessageAttributeValue>,
    });

    if (result.success) {
      // Delete message after successful processing
      if (message.ReceiptHandle) {
        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      }

      logger.info('Message processed and deleted from queue', {
        messageId,
        retryCount: result.retryCount || 0,
      });

      // Record SQS delete operation
      metrics.recordSqsOperation('delete', true);
    } else {
      logger.warn('Message processing failed', {
        messageId,
        error: result.error,
        retryCount: result.retryCount || 0,
        shouldRetry: result.shouldRetry,
      });

      // Only delete if we shouldn't retry (e.g., sent to DLQ)
      if (!result.shouldRetry && message.ReceiptHandle) {
        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );

        logger.info('Message deleted after final failure', { messageId });
        metrics.recordSqsOperation('delete', true);
      } else {
        logger.info('Message will remain in queue for retry', {
          messageId,
          retryCount: result.retryCount || 0,
        });
      }
    }
  } catch (error) {
    logger.error('Unexpected error processing message', {
      messageId,
      error: error as Error,
    });

    // Message will remain in queue for retry
  }
}
