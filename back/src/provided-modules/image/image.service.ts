import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fsp from 'fs/promises';
import * as fs from 'fs';

@Injectable()
export class ImageService {
  private readonly saveDirectory = '/app/storage/files';
  private readonly xboxImagePath = '/app/storage/xbox.png';
  private readonly logger = new Logger(ImageService.name);

  // TODO::사용자가 임의로 넣는 경우 방지해야할듯
  async get(query: any) {
    let filePath = this.xboxImagePath;
    try {
      const url = query.url;
      const time = query.time;
      const cdn = query.cdn;
      const username = query.username;
      const code = query.code;
      const order = query.order;
      const ext = query.ext;
      const path = `${this.saveDirectory}/${username}/${code}`;
      const filename = `${time}+${cdn}+${username}+${code}+${order}.${ext}`;

      if (this.isInstagramUrl(url) === false) {
        throw new Error('인스타그램 URL이 아닙니다.');
      }

      if (!fs.existsSync(`${path}/${filename}`)) {
        await this.downloadAndSaveImage(url, path, filename);
      }
      filePath = `${path}/${filename}`;
    } catch (error) {
      this.logger.error(error.message);
    }
    return filePath;
  }

  private isInstagramUrl(url: string): boolean {
    const instagramPattern = /\.cdninstagram\.com\//;
    return instagramPattern.test(url);
  }

  private async downloadAndSaveImage(
    url: string,
    path: string,
    filename: string,
  ): Promise<void> {
    if (!fs.existsSync(path)) {
      this.createDirectory(path);
    }
    const response = await axios.get(url, { responseType: 'stream' });

    const writer = fs.createWriteStream(`${path}/${filename}`);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  private createDirectory(directoryPath: string) {
    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        throw error;
      }
    });
  }
}
