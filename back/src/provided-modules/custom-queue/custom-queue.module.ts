import { Module } from '@nestjs/common';
import { CustomQueueService } from './custom-queue.service';
import { FeedScrapModule } from '../feed-scrap/feed-scrap.module';
import { CustomQueueManageModule } from '../custom-queue-manage/custom-queue-manage.module';

@Module({
  imports: [FeedScrapModule, CustomQueueManageModule],
  providers: [CustomQueueService],
  exports: [CustomQueueService],
})
export class CustomQueueModule {}
