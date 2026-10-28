import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Search } from 'src/entities/search.entity';
import { File } from 'src/entities/file.entity';
import { ParseService } from 'src/provided-modules/parse/parse.service';
import { MoreThan, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CustomQueueManageService } from '../custom-queue-manage/custom-queue-manage.service';
import { Post } from 'src/entities/post.entity';
import { sleep } from 'src/common/sleep';
import { MoaException } from 'src/errors/custom-exceptions';
import { errorDefine } from 'src/errors/codes/errors';
import { SearchRequestDto } from 'src/dto/request/search-request.dto';
import { commonPlainToInstance } from 'src/common/utils/transformers';
import { SearchResponseDto } from 'src/dto/response/search-response.dto';
import { FileRequestDto } from 'src/dto/request/file-request.dto';
import { FileResponseDto } from 'src/dto/response/file-response.dto';
import { FeedCountService } from '../feed-count/feed-count.service';
import { DateTime } from 'luxon';

@Injectable()
export class FileService {
  private cdn = 'cdn4';
  private imageProxyUrl =
    process.env.ENV === 'prd'
      ? 'https://api.instagrammoa.com'
      : 'https://devapi.instagrammoa.com';
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly customQueueManageService: CustomQueueManageService,
    private readonly parseService: ParseService,
    private readonly feedCountService: FeedCountService,
    @InjectRepository(Search)
    private readonly searchRepo: Repository<Search>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async search(
    searchRequestDto: SearchRequestDto,
    clientIp,
  ): Promise<SearchResponseDto> {
    const [mode, key] = this.parseService.keyword(searchRequestDto.keyword);
    this.logger.debug(`mode : ${mode}, key : ${key}, ip: ${clientIp}`);

    if (key === '') {
      throw new MoaException(errorDefine['bad_request']);
    }
    let result;
    switch (mode) {
      case 'user':
        result = await this.user(key, clientIp);
        break;
      case 'post':
        result = await this.post(key);
        break;
      default:
        break;
    }

    return commonPlainToInstance(SearchResponseDto, result);
  }

  async user(key, clientIp) {
    const data = {
      username: key,
    };
    let user = await this.userRepo.findOne({
      where: data,
    });

    // 오래됐으면 다 지우고 새로 넣기(feed가 많은 경우에만)
    // TODO::다 지우지말고 추가된 부분만 넣기
    if (user !== null && this.isOldScrapCheck(user.updatedAt)) {
      const news = await this.feedCountService.run(key);
      if (news.isPrivate === false && news.feedCount > user.feedCount) {
        user = null;
        await this.deleteAll(key);
      } else {
        user.feedCount = DateTime.local().setZone('Asia/Seoul');
        user = await this.userRepo.save(user);
      }
    }

    if (user?.status === 404) {
      throw new MoaException(errorDefine['not_found']);
    }
    if (user?.status === 403) {
      throw new MoaException(errorDefine['private_account']);
    }
    if (user?.status === 204) {
      throw new MoaException(errorDefine['no_content']);
    }
    if (!user) {
      user = await this.userRepo.save(data);
      await this.customQueueManageService.insertUser(key, clientIp);
      user = await this.waitScrap(key);
    }

    return {
      mode: 'user',
      key: key,
      seq: user.seq,
      status: user.status,
    };
  }

  // 스크랩한지 24시간 이상 지났는지 체크
  private isOldScrapCheck(createdAt): boolean {
    const targetTime = new Date(createdAt);
    const futureTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000); // 24시간 더하기
    const currentTime = new Date();

    return futureTime.getTime() < currentTime.getTime();
  }

  private async deleteAll(key) {
    await this.fileRepo.delete({ username: key });
    await this.postRepo.delete({ username: key });
    await this.userRepo.delete({ username: key });
  }

  async post(key) {
    const data = {
      code: key,
    };
    let post = await this.postRepo.findOne({
      where: data,
    });

    if (post?.status === 404) {
      throw new MoaException(errorDefine['not_found']);
    }

    if (!post) {
      post = await this.postRepo.save(data);
      // await this.customQueueManageService.insertUser(key);
      // await this.waitScrap(key);
    }

    return {
      mode: 'post',
      key: key,
      seq: post.seq,
      status: post.status,
    };
  }

  async waitScrap(key) {
    let user;
    for (let i = 0; i < 60; i++) {
      user = await this.userRepo.findOne({
        where: { username: key, status: MoreThan(100) },
      });
      if (user) {
        break;
      }
      await sleep(1000);
    }
    return user;
  }

  async getFiles(fileRequestDto: FileRequestDto): Promise<FileResponseDto[]> {
    let files;
    const page = fileRequestDto.page;
    const mode = fileRequestDto.mode;
    const limit = 12;
    const seq = fileRequestDto.seq ?? '';
    const skip = (page - 1) * limit;

    let whereCondition;
    if (mode === 'user') {
      whereCondition = { userSeq: seq };
    } else if (mode === 'post') {
      whereCondition = { postSeq: seq };
    } else {
      return;
    }
    const totalCount = await this.fileRepo.count({
      where: whereCondition,
    });

    let lastPage = false;
    if (totalCount <= skip + limit) {
      lastPage = true;
    }

    for (let i = 0; i < 10; i++) {
      files = await this.fileRepo.find({
        where: whereCondition,
        skip,
        take: limit,
        order: { createdAt: 'ASC', takenAt: 'DESC', order: 'ASC' },
      });
      if (files.length > 0) {
        break;
      }
      await sleep(1000);
    }

    const data = {
      username: files[0].username,
    };
    const user = await this.userRepo.findOne({
      where: data,
    });
    // 다 받음
    if (user.status === 200) {
      files = files.map((e) => {
        const { ...rest } = e;
        const { imageLocal, username, code, ...rest2 } = rest;
        return {
          ...rest,
          imageUrl: `https://${this.cdn}.instagrammoa.com/${username}/${code}/${imageLocal}`,
        };
      });
      // 프록시 사용
    } else {
      files = files.map((e) => {
        const { ...rest } = e;
        const { imageUrl, takenAt, cdn, username, code, order, ...rest2 } =
          rest;
        const params = {
          url: imageUrl,
          time: takenAt,
          cdn: cdn,
          username: username,
          code: code,
          order: this.zfill3(order),
          ext: 'jpg',
        };
        const query = new URLSearchParams(params).toString();
        return {
          ...rest,
          imageUrl: `${this.imageProxyUrl}/api/images?${query}`,
        };
      });
    }

    return files.map((file) => {
      return commonPlainToInstance(FileResponseDto, {
        ...file,
        lastPage: lastPage,
      });
    });
  }

  private zfill3(text: any): string {
    return String(text).padStart(3, '0');
  }
}
