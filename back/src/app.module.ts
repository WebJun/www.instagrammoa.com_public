import { Module } from '@nestjs/common';
import { ConfigureModule } from './configures/configure.module';
import { DatabaseModule } from './database/database.module';
import { ImageModule } from './provided-modules/image/image.module';
import { FileModule } from './provided-modules/file/file.module';
import { IpChangeModule } from './provided-modules/ip-change/ip-change.module';
import { CustomQueueModule } from './provided-modules/custom-queue/custom-queue.module';

const coreModules = [ConfigureModule, DatabaseModule];

@Module({
  imports: [
    ...coreModules,
    ImageModule,
    FileModule,
    IpChangeModule,
    CustomQueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
