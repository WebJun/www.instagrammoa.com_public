import { Injectable, Logger } from '@nestjs/common';
import { FeedScrapService } from '../feed-scrap/feed-scrap.service';
import { CustomQueueManageService } from '../custom-queue-manage/custom-queue-manage.service';
import { sleep } from 'src/common/sleep';

@Injectable()
export class CustomQueueService {
  private readonly logger = new Logger(CustomQueueService.name);

  constructor(
    private readonly customQueueManageService: CustomQueueManageService,
    private readonly feedScrapService: FeedScrapService,
  ) {}

  async run() {
    while (true) {
      try {
        const queue = await this.customQueueManageService.highPriorityQueue();
        if (queue) {
          await this.feedScrapService.run(queue);
        }
      } catch (e) {
        this.logger.error(e.message);
      }
      this.logger.debug(`${new Date()}`);
      await sleep(500);
    }
  }
}
