/**
 * @since 2023.09.20
 * @summary business logic exception Type
 * @onlyUse DesignCenterException | ExceptionResponseBodyType
 */
export type BusinessLogicExceptionType = {
  readonly code: string | number;
  readonly message: string;
};
