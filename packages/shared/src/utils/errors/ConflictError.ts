import { StatusCode } from '@counsy-ai/types';
import { ErrorBase } from './error.base';

export class ConflictError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.CONFLICT });
  }
}
