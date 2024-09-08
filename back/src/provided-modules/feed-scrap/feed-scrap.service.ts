import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Search } from 'src/entities/search.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { File } from 'src/entities/file.entity';
import { InstaApiService } from 'src/provided-modules/insta-api/insta-api.service';
import { MapperService } from 'src/provided-modules/mapper/mapper.service';
import { Repository } from 'typeorm';
import { FileScrapService } from '../file-scrap/file-scrap.service';
import { Feed } from 'src/entities/feed.entity';
import { TelegramService } from '../telegram/telegram.service';
import { CustomQueueManageService } from '../custom-queue-manage/custom-queue-manage.service';

@Injectable()
export class FeedScrapService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly instaApiService: InstaApiService,
    private readonly mapperService: MapperService,
    private readonly fileScrapService: FileScrapService,
    private readonly customQueueManageService: CustomQueueManageService,
    @InjectRepository(Search)
    private readonly searchRepo: Repository<Search>,
    @InjectRepository(Feed)
    private readonly feedRepo: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async run(queue) {
    const mode = queue.mode;
    const key = queue.key;
    const ip = queue.ip;

    if (queue.status === 'user') {
      const status = await this.user(queue);
      if (status === '404') {
        const user = await this.userRepo.findOne({
          where: { username: key },
        });
        user.status = parseInt(status);
        await this.userRepo.save(user);
        await this.customQueueManageService.complate(queue);
        this.telegram(mode, key, ip, '페이지 없음');
      } else if (status === '403') {
        const user = await this.userRepo.findOne({
          where: { username: key },
        });
        user.status = parseInt(status);
        await this.userRepo.save(user);
        await this.customQueueManageService.complate(queue);
        this.telegram(mode, key, ip, '비공개 계정');
      } else if (status === '204') {
        const user = await this.userRepo.findOne({
          where: { username: key },
        });
        user.status = parseInt(status);
        await this.userRepo.save(user);
        await this.customQueueManageService.complate(queue);
        this.telegram(mode, key, ip, '피드 없음');
      } else if (status === '200') {
        await this.feed(queue, true);
        await this.customQueueManageService.updatePriority(queue);
      } else {
        await this.customQueueManageService.complate(queue);
        this.telegram(mode, key, ip, '알 수 없는 오류');
      }
    } else {
      const isComplate = await this.feed(queue, false);
      if (isComplate === false) {
        await this.customQueueManageService.updatePriority(queue);
      }
    }
  }

  telegram(mode, key, ip, status) {
    let url = 'https://www.instagrammoa.com';
    if (process.env.ENV === 'dev') {
      url = 'https://devwww.instagrammoa.com';
    }
    switch (mode) {
      case 'user':
        url = `${url}/${key}/`;
        break;
      case 'post':
        url = `${url}/p/${key}/`;
        break;
      case 'tag':
        url = `${url}/explore/tags/${key}/`;
        break;
    }
    this.telegramService.send(`${url} ${ip} ${status}`);
  }

  async user(queue) {
    let status;
    try {
      const mode = queue.mode;
      const key = queue.key;
      const ip = queue.ip;
      this.telegram(mode, key, ip, '시작');
      const user = await this.userRepo.findOne({ where: { username: key } });

      this.instaApiService.setUsername(key);
      this.mapperService.setUsername(key);
      this.fileScrapService.setUsername(key);

      const data = await this.instaApiService.getUser();
      if (data === '404') {
        throw new Error('404'); // 페이지 없음
      }
      const user2 = this.mapperService.user(data);
      user2.seq = user.seq;
      await this.userRepo.save(user2);
      if (user2.isPrivate === true) {
        throw new Error('403'); // 비공개 계정
      }
      if (user2.feedCount === 0) {
        throw new Error('204'); // 피드 없음
      }
      this.instaApiService.setUserPk(user2.pk);

      await this.customQueueManageService.updateStatusFeed(queue);
      status = '200';
    } catch (error) {
      if (error.message === '404') {
        status = '404';
      } else if (error.message === '403') {
        status = '403';
      } else if (error.message === '204') {
        status = '204';
      }
    }
    return status;
  }

  async feed(queue, isFirst) {
    const mode = queue.mode;
    const key = queue.key;
    const ip = queue.ip;
    let maxId = queue.maxId;
    let loop = queue.loop;

    this.instaApiService.setUsername(key);
    this.mapperService.setUsername(key);
    this.fileScrapService.setUsername(key);

    const user = await this.userRepo.findOne({ where: { username: key } });
    this.instaApiService.setUserPk(user.pk);

    const user2 = await this.userRepo.findOne({
      where: { username: key },
    });
    const data2 = await this.instaApiService.getFeed(maxId);
    const feed = this.mapperService.feed(user2, data2);
    await this.saveFeed(data2, feed, key);
    await this.savePostAndFile(feed, user2);
    if (isFirst === true) {
      const user = await this.userRepo.findOne({ where: { username: key } });
      user.status = 101;
      await this.userRepo.save(user);
    }
    await this.fileScrapService.run();

    maxId = feed.nextMaxId;
    loop = feed.moreAvailable;
    console.log(loop, maxId);

    // 완료처리
    const isComplate = queue.status === 'feed' && loop === false;
    if (isComplate) {
      const search = await this.userRepo.findOne({ where: { username: key } });
      search.status = 200;
      await this.userRepo.save(search);
      await this.customQueueManageService.complate(queue);
      this.telegram(mode, key, ip, '완료');
    } else {
      await this.customQueueManageService.updateMaxId(queue, maxId, loop);
    }
    return isComplate;
  }

  async saveFeed(data, feed, key) {
    const aa = {
      // content: JSON.stringify(data), // 용량이 너무 커짐
      loop: feed.moreAvailable,
      maxId: feed.nextMaxId ?? '',
      username: key,
    };
    await this.feedRepo.save(aa);
  }

  async savePostAndFile(feed, user2) {
    feed.posts = await this.postRepo.save(feed.posts);
    const files = [];
    for (const post of feed.posts) {
      for (const file of post.files) {
        file.postSeq = post.seq;
        file.userSeq = user2.seq;
        files.push(file);
      }
    }
    await this.fileRepo.save(files);
  }
}
