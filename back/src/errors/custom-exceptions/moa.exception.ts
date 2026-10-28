import { HttpException } from '@nestjs/common';
import { ErrorValue } from '../types/errors-define-types';

//
export class MoaException extends HttpException {
  constructor(errorDefine: ErrorValue) {
    super(
      {
        status: errorDefine.status,
      },
      errorDefine.httpStatusCode,
    );
  }
}
