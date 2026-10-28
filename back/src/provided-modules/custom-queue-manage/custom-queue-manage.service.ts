import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'src/entities/quque.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CustomQueueManageService {
  private readonly logger = new Logger(CustomQueueManageService.name);

  constructor(
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
  ) {}

  async insertUser(key, clientIp) {
    await this.queueRepo.save({
      mode: 'user',
      key: key,
      ip: clientIp,
      status: 'user',
      priority: 1,
      maxId: '',
    });
  }

  async highPriorityQueue() {
    return await this.queueRepo
      .createQueryBuilder('queue')
      .orderBy('queue.priority', 'ASC')
      .addOrderBy('queue.seq', 'ASC')
      .limit(1)
      .getOne();
  }

  async updateStatusFeed(queue) {
    queue.status = 'feed';
    await this.queueRepo.save(queue);
  }

  async complate(queue) {
    await this.queueRepo.delete(queue.seq);
  }

  async updateMaxId(queue, maxId, loop) {
    queue.maxId = maxId;
    queue.loop = loop;
    await this.queueRepo.save(queue);
  }

  /*
   * queue 100초과인 레코드를 찾아서 제일 높은거의 +1해줘야한다
   * 없다면 101이다.
   */
  async updatePriority(queue) {
    queue.priority = await this.getPriority();
    await this.queueRepo.save(queue);
  }

  async getPriority() {
    const queue = await this.queueRepo.findOne({
      where: {
        priority: MoreThan(100),
      },
      order: {
        priority: 'DESC',
      },
    });
    if (!queue) {
      return 101;
    }
    return queue.priority + 1;
  }
}
