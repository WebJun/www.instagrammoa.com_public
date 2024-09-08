import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
@Injectable()
export class MapperService {
  private username = '';
  private cdn = 'cdn4';

  user(data) {
    const user = data.data.user;
    const result = {
      seq: '',
      username: user.username,
      fullName: user.full_name,
      feedCount: user.edge_owner_to_timeline_media.count,
      biography: user.biography,
      pk: user.id,
      externalUrl: user.external_url,
      isPrivate: user.is_private,
      isVerified: user.is_verified,
      isBusinessAccount: user.is_business_account,
    };
    return result;
  }

  setUsername(username) {
    this.username = username;
  }

  feed(user, data) {
    const posts = [];

    for (const index in data.items) {
      const item = data.items[index];
      const takenAt = item.taken_at;
      const code = item.code;
      const post = {
        code: code,
        status: 200,
        takenAt: takenAt,
        pk: item.pk,
        text: item.caption?.text,
        mediaType: item.media_type,
        username: user.username,
        userSeq: user.seq,
        files: [],
        order: index,
      };
      const files = [];
      if (item.carousel_media) {
        for (const i in item.carousel_media) {
          const file = this.inner(
            item.carousel_media[i],
            code,
            takenAt,
            parseInt(i) + 1,
          );
          files.push(file);
        }
      } else {
        const file = this.inner(item, code, takenAt, 1);
        files.push(file);
      }
      post.files = files;
      posts.push(post);
    }

    const result = {
      posts: posts,
      moreAvailable: data.more_available,
      nextMaxId: data.next_max_id,
    };
    return result;
  }

  inner(item, code, takenAt, index) {
    let imageUrl = '';
    let videoUrl = '';
    if ('image_versions2' in item) {
      imageUrl = item.image_versions2.candidates[0].url;
    }
    if ('video_versions' in item) {
      videoUrl = item.video_versions[0].url;
    }
    let file: any = {
      pk: item.id,
      imageUrl: imageUrl,
      videoUrl: videoUrl,
      username: this.username,
      code: code,
      takenAt: takenAt,
      cdn: this.cdn,
      order: index,
    };
    file = this.getLocalname(file, index);
    return file;
  }

  getLocalname(file, index) {
    // UTC 시각. nestjs 타임존에 영향받음.
    const time = DateTime.fromSeconds(file.takenAt).toFormat('yyyyMMddHHmmss');
    const zindex = this.zfill3(index);
    const name = `${time}+${this.cdn}+${file.username}+${file.code}+${zindex}`;
    if (file.imageUrl) {
      file.imageLocal = `${name}.jpg`;
    }
    if (file.videoUrl) {
      file.videoLocal = `${name}.mp4`;
    }
    return file;
  }

  zfill3(text: any): string {
    return String(text).padStart(3, '0');
  }
}
