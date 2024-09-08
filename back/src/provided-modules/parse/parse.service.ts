import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseService {
  private static readonly MAX_LENGTH = 255;

  keyword(keyword: string): [string, string] {
    let parsedKeyword = keyword.trim();
    parsedKeyword = this.extractBeforeQuestionMark(parsedKeyword);
    parsedKeyword = this.extractFromUrl(parsedKeyword, 'instagram.com/', 14);
    parsedKeyword = this.extractFromUrl(parsedKeyword, 'instagrammoa.com/', 17);

    parsedKeyword = this.processSpecialCharacters(parsedKeyword);

    const [mode, pKeyword] = this.determineMode(parsedKeyword);

    return [mode, pKeyword.toLowerCase()];
  }

  private extractBeforeQuestionMark(keyword: string): string {
    const pos = keyword.indexOf('?');
    return pos !== -1 ? keyword.substring(0, pos) : keyword;
  }

  private extractFromUrl(
    keyword: string,
    urlPattern: string,
    cutOffIndex: number,
  ): string {
    const pos = keyword.indexOf(urlPattern);
    return pos !== -1
      ? keyword.substring(pos + cutOffIndex, ParseService.MAX_LENGTH)
      : keyword;
  }

  private processSpecialCharacters(keyword: string): string {
    if (keyword[0] === '#') {
      return `explore/tags/${keyword.substring(1, ParseService.MAX_LENGTH)}/`;
    }
    if (keyword[0] === '/') {
      return keyword.substring(1, ParseService.MAX_LENGTH);
    }
    if (!/^[\w]/.test(keyword)) {
      return `explore/tags/${keyword}/`;
    }
    return keyword;
  }

  private determineMode(keyword: string): [string, string] {
    let mode: string;
    if (keyword.startsWith('explore/tags/')) {
      mode = 'tag';
      keyword = keyword.substring(13, ParseService.MAX_LENGTH);
    } else if (keyword.startsWith('p/')) {
      mode = 'post';
      keyword = keyword.substring(2, ParseService.MAX_LENGTH);
    } else {
      mode = 'user';
    }
    const pos = keyword.indexOf('/');
    return [mode, pos !== -1 ? keyword.substring(0, pos) : keyword];
  }
}
