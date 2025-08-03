import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
import { ExampleAgent } from './agents/example-agent';
export * from './agents/index';
import { APP_CONFIG } from '@counsy-ai/types';

export const agents = {
  exampleAgent: new ExampleAgent().getAgent(),
};

export const mastra: Mastra = new Mastra({
  agents,
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    enabled: true,
    serviceName: APP_CONFIG.basics.prefix,
    tracerName: APP_CONFIG.basics.prefix,
  },
});
