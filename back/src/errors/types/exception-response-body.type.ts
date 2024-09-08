import { BusinessLogicExceptionType } from './business-logic-exception.type';
import { UnitValidateExceptionType } from './unit-validate-exception.type';

/**
 * @comment 예외 발생시 응답 Type
 */
export type ExceptionResponseBodyType = {
  readonly errors: [BusinessLogicExceptionType] | UnitValidateExceptionType[];
};
