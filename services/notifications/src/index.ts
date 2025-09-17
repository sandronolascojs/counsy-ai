import { handler } from './handler';
import { startLocalServer } from './server';
import { logger } from './utils/logger.instance';

// Export the Lambda handler for cloud deployment
export { handler };

// Start local server if not running in Lambda environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  logger.info('Starting notifications service in local mode');
  startLocalServer().catch((error) => {
    logger.error('Failed to start local server', { error: error as Error });
    process.exit(1);
  });
}
