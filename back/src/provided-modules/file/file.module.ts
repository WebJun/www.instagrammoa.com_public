import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { InstaApiModule } from 'src/provided-modules/insta-api/insta-api.module';
import { ParseModule } from 'src/provided-modules/parse/parse.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { File } from 'src/entities/file.entity';
import { Search } from 'src/entities/search.entity';
import { CustomQueueManageModule } from '../custom-queue-manage/custom-queue-manage.module';
import { FeedCountModule } from '../feed-count/feed-count.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Search, User, Post, File]),
    InstaApiModule,
    ParseModule,
    CustomQueueManageModule,
    FeedCountModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
