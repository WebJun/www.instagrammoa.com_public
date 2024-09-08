import { Module } from '@nestjs/common';
import { InstaApiService } from './insta-api.service';
import { IpChangeModule } from '../ip-change/ip-change.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [IpChangeModule, TelegramModule],
  providers: [InstaApiService],
  exports: [InstaApiService],
})
export class InstaApiModule {}
