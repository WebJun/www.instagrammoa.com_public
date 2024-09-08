import { Module } from '@nestjs/common';
import { CustomQueueManageService } from './custom-queue-manage.service';
import { Queue } from 'src/entities/quque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])],
  providers: [CustomQueueManageService],
  exports: [CustomQueueManageService],
})
export class CustomQueueManageModule {}
