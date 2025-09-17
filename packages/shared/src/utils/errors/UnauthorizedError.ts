import { StatusCode } from '@counsy-ai/types';
import { ErrorBase } from './error.base';

export class UnauthorizedError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.UNAUTHORIZED });
  }
}
