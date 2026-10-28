import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import { Not } from 'typeorm';

@Injectable()
export class FileScrapService {
  private username = '';
  private saveDirectory = '/app/storage/files';
  private readonly logger = new Logger(FileScrapService.name);

  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  setUsername(username: string): void {
    this.username = username;
  }

  async run(): Promise<void> {
    await this.asyncDownloadImage();
    await this.syncDownloadVideo();
  }

  private async asyncDownloadImage() {
    const files = await this.fileRepo.find({
      where: { username: this.username, imageStatus: 0 },
    });
    const concurrency = 5; // 동시에 처리할 요청 수
    const downloadPromises = [];

    for (const file of files) {
      const downloadPromise = (async () => {
        try {
          const dirPath = `${this.saveDirectory}/${file.username}/${file.code}`;
          const filePath = `${dirPath}/${file.imageLocal}`;
          if (await this.asyncCheckFileExists(filePath)) {
            throw new Error('already');
          }
          await fsp.mkdir(dirPath, { recursive: true });

          const response = await axios.get(file.imageUrl, {
            responseType: 'arraybuffer',
          });
          await fsp.writeFile(filePath, response.data);
          file.imageStatus = 200;
          this.fileRepo.save(file);
        } catch (error) {
          if (error.message == 'already') {
            this.logger.debug(`${file.seq}: ${error.message}`);
            file.imageStatus = 201;
            this.fileRepo.save(file);
          } else {
            this.logger.error(`${file.seq}: ${error.message}`);
            file.imageStatus = 404;
            this.fileRepo.save(file);
          }
        }
      })();

      downloadPromises.push(downloadPromise);

      if (downloadPromises.length >= concurrency) {
        await Promise.all(downloadPromises);
        downloadPromises.length = 0;
      }
    }
    await Promise.all(downloadPromises);
  }

  private async syncDownloadVideo() {
    const files = await this.fileRepo.find({
      where: { username: this.username, videoStatus: 0, videoUrl: Not('') },
    });
    for (const file of files) {
      try {
        const dirPath = `${this.saveDirectory}/${file.username}/${file.code}`;
        const filePath = `${dirPath}/${file.videoLocal}`;
        if (fs.existsSync(filePath)) {
          throw new Error('already');
        }
        if (fs.existsSync(dirPath) === false) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const response = await axios.get(file.videoUrl, {
          responseType: 'arraybuffer',
        });
        fs.writeFileSync(filePath, response.data);
        file.videoStatus = 200;
        this.fileRepo.save(file);
      } catch (error) {
        if (error.message == 'already') {
          this.logger.debug(`${file.seq}: ${error.message}`);
          file.videoStatus = 201;
          this.fileRepo.save(file);
        } else {
          this.logger.error(`${file.seq}: ${error.message}`);
          file.videoStatus = 404;
          this.fileRepo.save(file);
        }
      }
    }
  }

  async asyncCheckFileExists(filePath: string): Promise<boolean> {
    try {
      await fsp.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
