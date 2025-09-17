export type { SnsEvent, SnsMessageAttributes, SnsRecord } from '@counsy-ai/types';

// Minimal SQS event type used when SNS delivers notifications via SQS
export interface SqsRecord {
  messageId: string;
  receiptHandle: string;
  body: string; // JSON string: SNS envelope with Message + MessageAttributes
}

export interface SqsEvent {
  Records: SqsRecord[];
}

export interface SendEmailRequest {
  template: string;
  to: string;
  subject: string;
  props?: Record<string, unknown>;
}
