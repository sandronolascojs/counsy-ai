import { StatusCode } from '@counsy-ai/types';
import { ErrorBase } from './error.base';

export class ForbiddenError extends ErrorBase {
  constructor({ message }: { message: string }) {
    super({ message, statusCode: StatusCode.FORBIDDEN });
  }
}
