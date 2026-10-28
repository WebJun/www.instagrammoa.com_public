/**
 * @since 2023.08.01
 * @summary 이 타입으로 에러를 정의
 */
export type SubErrorCode = string;
export type ErrorValue = {
  /**
   * @description HttpStatusCode 기술
   */
  readonly httpStatusCode;

  /**
   * @description 정의할 에러 코드 기술
   */
  readonly code: SubErrorCode;

  /**
   * @description 에러 메시지 기술
   */
  readonly message: string;

  readonly status: number;
};
export type ErrorDefine = Record<SubErrorCode, ErrorValue>;
