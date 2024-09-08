import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './libraries/winston/winston.logger.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useLogger(new WinstonLoggerService(configService));
  app.enableCors();
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
