import { Injectable } from '@nestjs/common';
import { InstaApiService } from 'src/provided-modules/insta-api/insta-api.service';
import { MapperService } from 'src/provided-modules/mapper/mapper.service';

@Injectable()
export class FeedCountService {
  constructor(
    private readonly instaApiService: InstaApiService,
    private readonly mapperService: MapperService,
  ) {}

  async run(key) {
    let status;
    let feedCount;
    let isPrivate;
    try {
      this.instaApiService.setUsername(key);
      this.mapperService.setUsername(key);

      const data = await this.instaApiService.getUser();
      if (data === '404') {
        throw new Error('404'); // 페이지 없음
      }
      const user = this.mapperService.user(data);
      feedCount = user.feedCount;
      isPrivate = user.isPrivate;
      status = 200;
    } catch (error) {
      status = error.message;
    }

    return {
      feedCount: feedCount,
      status: status,
      isPrivate: isPrivate,
    };
  }
}
