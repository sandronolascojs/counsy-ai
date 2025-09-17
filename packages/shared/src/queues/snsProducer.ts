import type { MessageAttributeValue } from '@aws-sdk/client-sns';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { NotificationsQueues } from '@counsy-ai/types';
import { transporterForQueue } from './snsUtils';

export interface TypedSnsProducerParams {
  region: string;
  topicArn: string;
}

export class TypedSnsProducer {
  private readonly sns: SNSClient;
  private readonly topicArn: string;

  constructor(params: TypedSnsProducerParams) {
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
  }

  // Generic queue sender with autocomplete by queue name
  async sendToQueue<TQueue extends keyof NotificationsQueues>(
    queue: TQueue,
    payload: NotificationsQueues[TQueue],
    options?: {
      attributes?: Record<string, MessageAttributeValue>;
      userId?: string;
      eventType?: string;
      eventVersion?: string | number;
      correlationId?: string;
      source?: string;
    },
  ): Promise<void> {
    const transporter = transporterForQueue(queue);

    const attrs: Record<string, MessageAttributeValue> = {
      queue: { DataType: 'String', StringValue: transporter },
      ...(options?.attributes ?? {}),
    };
    if (options?.userId) {
      attrs.userId = { DataType: 'String', StringValue: options.userId };
    }
    if (options?.eventType) {
      attrs.eventType = { DataType: 'String', StringValue: options.eventType };
    }
    if (options?.eventVersion !== undefined) {
      attrs.eventVersion = { DataType: 'String', StringValue: String(options.eventVersion) };
    }
    if (options?.correlationId) {
      attrs.correlationId = { DataType: 'String', StringValue: options.correlationId };
    }
    if (options?.source) {
      attrs.source = { DataType: 'String', StringValue: options.source };
    }

    await this.sns.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(payload),
        MessageAttributes: attrs,
      }),
    );
  }
}
