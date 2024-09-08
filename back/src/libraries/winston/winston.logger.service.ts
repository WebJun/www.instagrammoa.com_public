import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    // const loggerOptions = this.configService.get('winstonLoggerOptions');
    // this.logger = winston.createLogger(loggerOptions);
    this.logger = winston.createLogger({
      transports: [
        // DailyRotateFile 전송 객체 생성
        new DailyRotateFile({
          level: 'info',
          filename: `${process.env.LOG_PATH}/info/info-%DATE%.log`, // 로그 파일 경로 및 이름 설정
          datePattern: 'YYYY-MM-DD', // 날짜 패턴 설정
          zippedArchive: true, // 압축 아카이브 여부 설정
          maxSize: '20m', // 로그 파일 최대 크기 설정
          maxFiles: '300d', // 로그 파일 최대 보존 기간 설정
          format: winston.format.combine(
            // 로그 포맷 설정
            winston.format.timestamp(), // 타임스탬프 추가
            winston.format.json(), // JSON 형식으로 로그 저장
          ),
        }),
        // DailyRotateFile 전송 객체 생성
        new DailyRotateFile({
          level: 'debug',
          filename: `${process.env.LOG_PATH}/debug/debug-%DATE%.log`, // 로그 파일 경로 및 이름 설정
          datePattern: 'YYYY-MM-DD', // 날짜 패턴 설정
          zippedArchive: true, // 압축 아카이브 여부 설정
          maxSize: '20m', // 로그 파일 최대 크기 설정
          maxFiles: '300d', // 로그 파일 최대 보존 기간 설정
          format: winston.format.combine(
            // 로그 포맷 설정
            winston.format.timestamp(), // 타임스탬프 추가
            winston.format.json(), // JSON 형식으로 로그 저장
          ),
        }),
        // DailyRotateFile 전송 객체 생성
        new DailyRotateFile({
          level: 'error',
          filename: `${process.env.LOG_PATH}/errors/error-%DATE%.log`, // 로그 파일 경로 및 이름 설정
          datePattern: 'YYYY-MM-DD', // 날짜 패턴 설정
          zippedArchive: false, // 압축 아카이브 여부 설정
          maxSize: '20m', // 로그 파일 최대 크기 설정
          maxFiles: '300d', // 로그 파일 최대 보존 기간 설정
          format: winston.format.combine(
            // 로그 포맷 설정
            winston.format.timestamp(), // 타임스탬프 추가
            winston.format.json(), // JSON 형식으로 로그 저장
          ),
        }),
        // 콘솔 출력 전송 객체 생성
        new winston.transports.Console({
          level: 'debug', // 로그 레벨 설정
          handleExceptions: true, // 예외 처리 여부 설정
          format: winston.format.combine(
            winston.format.colorize({ all: true }), // 로그에 색상 추가
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 타임스탬프 추가
            winston.format.simple(), // 간단한 로그 형식
            winston.format.errors({ stack: true }),
            winston.format.printf(({ level, message, context, timestamp }) => {
              const colorHead = `\x1b[32m[Winston]\x1b[0m`; // 색깔별 이스케이프문자열을 반환하는
              const colorMessage = `\x1b[32m${message}\x1b[0m`;
              const colorContext = context ? `\x1b[33m[${context}]\x1b[0m` : '';
              const colorTimestamp = `\x1b[37m${timestamp}\x1b[0m`;
              const formattedMessage = `${colorHead} ${colorTimestamp} ${level} ${colorContext} ${colorMessage}`;
              return formattedMessage;
            }),
          ),
        }),
      ],
      exitOnError: false, // 에러 발생 시 프로세스 종료 여부 설정
    });
  }

  log(message: string, context?: string) {
    if (context) {
      this.logger.info(`${message}`, { context: `${context}` });
    } else {
      this.logger.info(message);
    }
  }

  info(message: string, context?: string): void {
    if (context) {
      this.logger.info(`${message}`, { context: `${context}` });
    } else {
      this.logger.info(message);
    }
  }

  debug(message: string, context?: string): void {
    if (context) {
      this.logger.debug(`${message}`, { context: `${context}` });
    } else {
      this.logger.debug(message);
    }
  }

  verbose(message: string, context?: string): void {
    if (context) {
      this.logger.verbose(`${message}`, { context: `${context}` });
    } else {
      this.logger.verbose(message);
    }
  }

  error(message: string, context?: string): void {
    if (context) {
      this.logger.error(`${message}`, { context: `${context}` });
    } else {
      this.logger.error(message);
    }
  }

  warn(message: string, context?: string): void {
    if (context) {
      this.logger.warn(`${message}`, { context: `${context}` });
    } else {
      this.logger.warn(message);
    }
  }
}
