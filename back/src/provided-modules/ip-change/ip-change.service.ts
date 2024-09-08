import { Injectable, Logger } from '@nestjs/common';
import { throws } from 'assert';
import axios from 'axios';

@Injectable()
export class IpChangeService {
  private readonly logger = new Logger(IpChangeService.name);
  private api = process.env.PROXY_API;
  async run() {
    this.logger.debug('아이피 변경 시도');
    let result = 500;
    try {
      const response = await axios.get(`${this.api}/changeIp`);
      if (response.data == 'success') {
        result = 200;
        this.logger.debug('아이피 변경 성공');
      } else {
        this.logger.debug('아이피 변경 실패2.');
      }
    } catch (error) {
      this.logger.debug(`아이피 변경 실패. ${error.message}`);
    }
    return result;
  }
}
