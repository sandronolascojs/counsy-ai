import { type DB } from '@counsy-ai/db';
import type { Logger } from '../telemetry/logger.js';

export abstract class BaseRepository {
  protected readonly db: DB;
  protected readonly logger: Logger;

  constructor(dbInstance: DB, logger: Logger) {
    this.db = dbInstance;
    this.logger = logger;
  }
}
