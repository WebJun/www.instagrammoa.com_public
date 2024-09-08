/**
 * @since 2023.09.20
 * @summary Pipe validate exception 객체 속성에 대한 예외 정보 Type
 * @onlyUse DesignCenterValidateException | ExceptionResponseBodyType | GlobalValidationPipe
 */
export type UnitValidateExceptionType = {
  readonly code: string; // code
  readonly classInstance: string; // 발생 예외 객체 (DTO or InputType)
  readonly property: string; // 예외 발생 파라미터 명
  readonly propertyDescription: string; // 예외 발생 파라미터 설명
  readonly validateRole: string; // class-validate 유효성 체크 Role
  readonly message: string; // 메시지
};
