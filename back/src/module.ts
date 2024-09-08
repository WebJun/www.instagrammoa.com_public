import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { MyService } from './service';
import { ConfigureModule } from './configures/configure.module';
import { DatabaseModule } from './database/database.module';
import { CustomQueueModule } from './provided-modules/custom-queue/custom-queue.module';
import { TelegramModule } from './provided-modules/telegram/telegram.module';

const coreModules = [ConfigureModule, DatabaseModule];

@Module({
  imports: [
    ...coreModules,
    ConsoleModule, // import the ConsoleModule
    CustomQueueModule,
    TelegramModule,
  ],
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
