import { Body, Controller, Post, Req } from '@nestjs/common';
import { FileService } from './file.service';
import { Request } from 'express';
import { SearchRequestDto } from 'src/dto/request/search-request.dto';
import { SearchResponseDto } from 'src/dto/response/search-response.dto';
import { FileRequestDto } from 'src/dto/request/file-request.dto';
import { FileResponseDto } from 'src/dto/response/file-response.dto';
import { Logger } from '@nestjs/common';

@Controller('api')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  @Post('search')
  async search(
    @Body() searchRequestDto: SearchRequestDto,
    @Req() request: Request,
  ): Promise<SearchResponseDto> {
    const clientIp = this.getClientIp(request);
    return await this.fileService.search(searchRequestDto, clientIp);
  }

  @Post('files')
  index(@Body() fileRequestDto: FileRequestDto): Promise<FileResponseDto[]> {
    return this.fileService.getFiles(fileRequestDto);
  }

  getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    let clientIp: string;
    if (Array.isArray(xForwardedFor)) {
      // x-forwarded-for가 배열인 경우, 첫 번째 요소를 사용
      clientIp = xForwardedFor[0];
    } else if (typeof xForwardedFor === 'string') {
      // x-forwarded-for가 문자열인 경우, 첫 번째 IP를 사용
      clientIp = xForwardedFor.split(',')[0].trim();
    } else {
      // x-forwarded-for가 없으면 기본 IP를 사용
      clientIp = request.ip;
    }

    return clientIp;
  }
}
