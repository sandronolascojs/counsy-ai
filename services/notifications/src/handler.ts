import type { SqsEvent } from '@/types';
import { processSqsEvent } from './processors/notificationProcessor';

// Lambda handler for SQS events (cloud)
export const handler = async (event: SqsEvent): Promise<void> => {
  await processSqsEvent(event);
};
