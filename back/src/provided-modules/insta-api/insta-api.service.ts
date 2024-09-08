import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs-extra';
import { DateTime } from 'luxon';
import { IpChangeService } from '../ip-change/ip-change.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class InstaApiService {
  private readonly logger = new Logger(InstaApiService.name);
  private api = process.env.PROXY_API;
  private username = '';
  private userPk = '';
  private maxChange = 10;
  private appId = '936619743392459';

  constructor(
    private readonly telegramService: TelegramService,
    private readonly ipChangeService: IpChangeService,
  ) {}

  setUsername(username) {
    this.username = username;
  }

  setUserPk(userPk) {
    this.userPk = userPk;
  }

  async getUser() {
    let result = '';
    const request = this.userData();
    let i = 0;
    let isIpChange = false;
    for (i = 0; i < this.maxChange; i++) {
      try {
        const response = await axios.post(`${this.api}/proxy`, request);
        await this.saveUser(response);
        result = response.data;

        // if (response.status === 404) {
        //   throw new Error('404');
        // }
        if (response.status !== 200) {
          throw new Error('http status code가 200이 아님');
        }
        if (response.data.data.user == null) {
          throw new Error('404'); // user 데이터 없음
        }
        if (
          response.data.message ==
          'Please wait a few minutes before you try again.'
        ) {
          isIpChange = true;
          throw new Error('429에러인건가1');
        }
        break;
      } catch (error) {
        this.logger.error(error.message);
        // const statusCode = error.response?.status;
        if (isIpChange) {
          await this.ipChangeService.run();
          isIpChange = false;
        } else {
          result = '404';
          break;
        }
      }
    }
    if (i >= this.maxChange) {
      this.telegramService.send('아이피 바꾸어도 안됨.');
    }
    return result;
  }

  async getFeed(maxId) {
    let result = '';
    const request = this.feedData(maxId);
    let i = 0;
    for (i = 0; i < this.maxChange; i++) {
      try {
        const response = await axios.post(`${this.api}/proxy`, request);
        await this.saveFeed(response);
        result = response.data;

        if (response.status !== 200) {
          throw new Error('http status code가 200이 아님');
        }
        if (
          response.data.message ==
          'Please wait a few minutes before you try again.'
        ) {
          throw new Error('429에러인건가2');
        }
        break;
      } catch (error) {
        this.logger.error(error.message);
        await this.ipChangeService.run();
      }
    }
    if (i >= this.maxChange) {
      this.telegramService.send('아이피 바꾸어도 안됨.');
    }
    return result;
  }

  async getPost(code) {
    let result = '';
    const request = this.postData(code);
    let i = 0;
    for (i = 0; i < this.maxChange; i++) {
      try {
        const response = await axios.post(`${this.api}/proxy`, request);
        await this.savePost(response);
        result = response.data;

        if (response.status !== 200) {
          throw new Error('http status code가 200이 아님');
        }
        break;
      } catch (error) {
        this.logger.error(error.message);
        await this.ipChangeService.run();
      }
    }
    if (i >= this.maxChange) {
      this.telegramService.send('아이피 바꾸어도 안됨.');
    }
    return result;
  }

  async saveUser(response): Promise<void> {
    try {
      const path = `storage/user`;
      const str = JSON.stringify(response.data, null, 2);
      this.createDirectoryIfNotExists(path);
      await fs.outputFile(`${path}/${this.username}_${this.now()}.json`, str);
    } catch (error) {}
  }

  async saveFeed(response): Promise<void> {
    try {
      const path = `storage/feed/${this.username}`;
      const str = JSON.stringify(response.data, null, 2);
      this.createDirectoryIfNotExists(path);
      await fs.outputFile(`${path}/${this.now()}.json`, str);
    } catch (error) {}
  }

  async savePost(response): Promise<void> {
    try {
      const path = `storage/posts/${this.username}`;
      const str = JSON.stringify(response.data, null, 2);
      this.createDirectoryIfNotExists(path);
      await fs.outputFile(`${path}/${this.now()}.json`, str);
    } catch (error) {}
  }

  createDirectoryIfNotExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  now(): string {
    const currentTime = DateTime.local();
    return currentTime.toFormat('yyyyMMddHHmmssSSS');
  }

  userData() {
    return {
      url: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${this.username}`,
      method: 'get',
      headers: {
        'x-ig-app-id': this.appId,
      },
    };
  }

  feedData(maxId) {
    return {
      url: `https://www.instagram.com/api/v1/feed/user/${this.userPk}/`,
      method: 'get',
      params: {
        count: '33',
        max_id: maxId,
      },
      headers: {
        'x-ig-app-id': this.appId,
      },
    };
  }

  postData(code) {
    return {
      url: `https://www.instagram.com/p/${code}/`,
      method: 'get',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        cookie:
          'sessionid=44776981787%3Almk9YeQyymFSUo%3A28%3AAYdBB9Tkzk1ucsD8_wn7ySuAyAC60cIMdRu9mYLQXw;',
        'sec-fetch-site': 'none',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };
  }
}
