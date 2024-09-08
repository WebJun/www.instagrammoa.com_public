import { Module } from '@nestjs/common';
import { FileScrapService } from './file-scrap.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileScrapService],
  exports: [FileScrapService],
})
export class FileScrapModule {}
