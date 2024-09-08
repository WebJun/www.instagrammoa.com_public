import { Controller, Get } from '@nestjs/common';
import { IpChangeService } from './ip-change.service';

@Controller('api')
export class IpChangeController {
  constructor(private readonly ipChangeService: IpChangeService) {}

  @Get('ip-change')
  async index() {
    return await this.ipChangeService.run();
  }
}
