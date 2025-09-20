import type { MessageAttributeValue } from '@aws-sdk/client-sns';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { Logger } from '@counsy-ai/shared';
import type { NotificationsQueues } from '@counsy-ai/types';

export interface TypedSnsProducerParams {
  region: string;
  topicArn: string;
}

export class TypedSnsProducer {
  private readonly sns: SNSClient;
  private readonly topicArn: string;
  private readonly logger: Logger;

  constructor(params: TypedSnsProducerParams, logger: Logger) {
    this.topicArn = params.topicArn;
    const isLocal = process.env.APP_ENV === 'development' || process.env.USE_LOCALSTACK === '1';
    const localEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
    this.sns = new SNSClient({
      region: params.region,
      ...(isLocal && {
        endpoint: localEndpoint,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
        },
      }),
    });
    this.logger = logger;
  }

  // Generic queue sender with autocomplete by queue name
  async sendToQueue<TQueue extends keyof NotificationsQueues>(
    queue: TQueue,
    payload: NotificationsQueues[TQueue],
    options?: {
      attributes?: Record<string, MessageAttributeValue>;
      eventType?: string;
      eventVersion?: string | number;
      source?: string;
      correlationId?: string;
      requestId?: string;
    },
  ): Promise<void> {
    const attrs: Record<string, MessageAttributeValue> = {
      queue: { DataType: 'String', StringValue: queue },
      ...(options?.attributes ?? {}),
    };

    // Extract userId from payload (essential data)
    if ('userId' in payload && payload.userId) {
      attrs.userId = { DataType: 'String', StringValue: payload.userId };
    }

    // Add metadata attributes
    if (options?.eventType) {
      attrs.eventType = { DataType: 'String', StringValue: options.eventType };
    }
    if (options?.eventVersion !== undefined) {
      attrs.eventVersion = { DataType: 'String', StringValue: String(options.eventVersion) };
    }
    if (options?.source) {
      attrs.source = { DataType: 'String', StringValue: options.source };
    }
    if (options?.correlationId) {
      attrs.correlationId = { DataType: 'String', StringValue: options.correlationId };
    }
    if (options?.requestId) {
      attrs.requestId = { DataType: 'String', StringValue: options.requestId };
    }

    await this.sns.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(payload),
        MessageAttributes: attrs,
      }),
    );

    this.logger.info('Message sent to SNS', {
      TopicArn: this.topicArn,
      MessageType: typeof payload,
      MessageSize: JSON.stringify(payload).length,
      AttributeCount: Object.keys(attrs).length,
    });
  }
}
