import type { SqsEvent } from '@/types';
import { processSqsEvent } from './processors/sqsProcessor';

// Lambda handler for SQS events (cloud)
export const handler = async (event: SqsEvent): Promise<void> => {
  await processSqsEvent(event);
};
