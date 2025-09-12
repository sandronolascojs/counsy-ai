import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { NotificationEventType, NotificationTransporterType } from '@counsy-ai/types';
import {
  NotificationEnvelopeByEventSchema,
  type NotificationEnvelopeByEvent,
} from '@counsy-ai/types';

// Type-level mapping: transporter -> event -> envelope subtype
type EnvelopesByTransporter = Extract<
  NotificationEnvelopeByEvent,
  { transporter: NotificationTransporterType }
>;

export type EnvelopeFor<
  TTransporter extends NotificationTransporterType,
  TEvent extends NotificationEventType,
> = Extract<EnvelopesByTransporter, { transporter: TTransporter; event: TEvent }>;

export interface TypedSnsProducerParams {
  region: string;
  topicArn: string;
}

export class TypedSnsProducer {
  private readonly sns: SNSClient;
  private readonly topicArn: string;

  constructor(params: TypedSnsProducerParams) {
    this.topicArn = params.topicArn;
    this.sns = new SNSClient({ region: params.region });
  }

  async publish<
    TTransporter extends NotificationTransporterType,
    TEvent extends NotificationEventType,
  >(message: EnvelopeFor<TTransporter, TEvent>): Promise<void> {
    const parsed = NotificationEnvelopeByEventSchema.safeParse(message);
    if (!parsed.success) {
      const validationMessage: string = parsed.error.message;
      throw new Error(
        validationMessage.length > 0 ? validationMessage : 'Invalid notification envelope',
      );
    }

    const transporter = parsed.data.transporter;
    const event = parsed.data.event;
    const userId = parsed.data.meta.userId;

    await this.sns.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(message),
        MessageAttributes: {
          transporter: { DataType: 'String', StringValue: transporter },
          event: { DataType: 'String', StringValue: event },
          userId: { DataType: 'String', StringValue: userId },
        },
      }),
    );
  }
}
