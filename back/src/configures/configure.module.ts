import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmOption } from './options';

/**
 * @since 2023.07.21
 * @summary 설정옵션 관리모듈
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [typeOrmOption],
    }),
  ],
})
export class ConfigureModule {}
