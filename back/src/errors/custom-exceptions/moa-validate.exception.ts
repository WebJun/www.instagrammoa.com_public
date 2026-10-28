import { HttpException, HttpStatus } from '@nestjs/common';
import { UnitValidateExceptionType } from '../types';

export class MoaValidateException extends HttpException {
  constructor(errors: UnitValidateExceptionType[]) {
    super({ errors }, HttpStatus.BAD_REQUEST);
  }
}
