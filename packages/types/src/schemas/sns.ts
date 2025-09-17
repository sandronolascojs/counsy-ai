// SNS event payloads as delivered to AWS Lambda (SNS → Lambda integration)

export type SnsMessageAttributes = Record<string, { Type: string; Value: string }>;

export interface SnsRecord {
  EventSource: string;
  EventVersion: string;
  EventSubscriptionArn: string;
  Sns: {
    Type: string;
    MessageId: string;
    TopicArn: string;
    Subject?: string | null;
    Message: string;
    Timestamp: string;
    SignatureVersion: string;
    Signature: string;
    SigningCertUrl: string;
    UnsubscribeUrl: string;
    MessageAttributes: SnsMessageAttributes;
  };
}

export interface SnsEvent {
  Records: SnsRecord[];
}

// ---- SQS event (Lambda trigger) and SNS envelope carried inside SQS body ----

export type SqsMessageAttributes = Record<
  string,
  { Type: 'String' | 'Number' | 'Binary'; Value: string }
>;

export interface SqsRecord {
  messageId: string;
  body: string;
  messageAttributes?: SqsMessageAttributes;
}

export interface SqsEvent {
  Records: SqsRecord[];
}

export interface SnsEnvelopeInSqs {
  Type?: string;
  Message?: string; // JSON string of original message
  MessageAttributes?: SnsMessageAttributes;
}
