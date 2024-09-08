import { HttpStatus } from '@nestjs/common';
import { ErrorDefine } from 'src/errors/types';

export const errorDefine: ErrorDefine = {
  bad_request: {
    httpStatusCode: HttpStatus.OK,
    code: 'bad_request',
    message: '잘못된 요청입니다.',
    status: 400,
  },
  not_found: {
    httpStatusCode: HttpStatus.OK,
    code: 'not_found',
    message: '페이지를 찾을 수 없습니다.',
    status: 404,
  },
  private_account: {
    httpStatusCode: HttpStatus.OK,
    code: 'private_account',
    message: '비공개 계정입니다.',
    status: 403,
  },
  no_content: {
    httpStatusCode: HttpStatus.OK,
    code: 'no_content',
    message: '피드가 없습니다.',
    status: 204,
  },
};
