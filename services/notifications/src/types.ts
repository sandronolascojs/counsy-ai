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

export interface SendEmailRequest {
  template: string;
  to: string;
  subject: string;
  props?: Record<string, unknown>;
}
