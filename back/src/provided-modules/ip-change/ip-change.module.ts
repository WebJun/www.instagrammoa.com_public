import { Module } from '@nestjs/common';
import { IpChangeService } from './ip-change.service';
import { IpChangeController } from './ip-change.controller';

@Module({
  controllers: [IpChangeController],
  providers: [IpChangeService],
  exports: [IpChangeService],
})
export class IpChangeModule {}
