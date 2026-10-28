import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * @since 2023.07.21
 * @summary TypeOrmModuleOptions 설정
 */
export const typeOrmOption = registerAs(
  'typeOrmOption',
  (): TypeOrmModuleOptions => ({
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    autoLoadEntities: true, // 이 옵션을 true 로 줌으로서, entity를 수동으로 알릴 필요가 없음.
    subscribers: [],
    synchronize: false, // 동기화 여부
    logging: false,
    timezone: 'Z', // mysql의 타임존.
  }),
);
