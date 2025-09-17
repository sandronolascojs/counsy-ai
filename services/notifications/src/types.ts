export type {
  SnsEvent,
  SnsMessageAttributes,
  SnsRecord,
  SqsEvent,
  SqsMessageAttributes,
  SqsRecord,
} from '@counsy-ai/types';

export interface SendEmailRequest {
  template: string;
  to: string;
  subject: string;
  props?: Record<string, unknown>;
}
