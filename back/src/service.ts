import { Injectable, Logger } from '@nestjs/common';
import { ConsoleService } from 'nestjs-console';
import { CustomQueueService } from './provided-modules/custom-queue/custom-queue.service';
import { TelegramService } from './provided-modules/telegram/telegram.service';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  constructor(
    private readonly telegramService: TelegramService,
    private readonly consoleService: ConsoleService,
    private readonly customQueueService: CustomQueueService,
  ) {
    // get the root cli
    const cli = this.consoleService.getCli();

    // create a single command (See [npm commander arguments/options for more details])
    this.consoleService.createCommand(
      {
        command: 'server',
        description: 'description',
      },
      this.onServer,
      cli, // attach the command to the cli
    );
  }

  onServer = async () => {
    const msg = `${process.env.ENV} 서버 시작`;
    this.logger.debug(msg);
    this.telegramService.send(msg);
    await this.customQueueService.run();
  };
}
