import { Module } from '@nestjs/common';
import { FeedScrapService } from './feed-scrap.service';
import { InstaApiModule } from 'src/provided-modules/insta-api/insta-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Search } from 'src/entities/search.entity';
import { File } from 'src/entities/file.entity';
import { MapperModule } from 'src/provided-modules/mapper/mapper.module';
import { FileScrapModule } from '../file-scrap/file-scrap.module';
import { Feed } from 'src/entities/feed.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { CustomQueueManageModule } from '../custom-queue-manage/custom-queue-manage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Search, Feed, User, Post, File]),
    TelegramModule,
    MapperModule,
    InstaApiModule,
    FileScrapModule,
    CustomQueueManageModule,
  ],
  providers: [FeedScrapService],
  exports: [FeedScrapService],
})
export class FeedScrapModule {}
