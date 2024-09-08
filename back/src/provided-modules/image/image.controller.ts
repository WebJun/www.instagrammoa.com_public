import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';

@Controller('api')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  /*
   * https://devapi.instagrammoa.com/api/images?
   * url=https%3A%2F%2Fscontent-ssn1-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F60261512_337768173552388_4760992335323537210_n.jpg%3Fstp%3Ddst-jpg_e35%26efg%3DeyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0NDAuc2RyIn0%26_nc_ht%3Dscontent-ssn1-1.cdninstagram.com%26_nc_cat%3D104%26_nc_ohc%3DlgEyrf4lorgAX-HNYGx%26edm%3DABmJApABAAAA%26ccb%3D7-5%26ig_cache_key%3DMjA1NDM3MDg4ODE0OTQxODAyMA%253D%253D.2-ccb7-5%26oh%3D00_AfCrBKV6BUqrz4pkMELNvy9c5UMgs47dUG6cBJJAZFlfaA%26oe%3D659AFC7C%26_nc_sid%3Db41fef
   * &time=20190529175558
   * &cdn=cdn4
   * &username=dlwlrma
   * &code=ByCl8RwATn_
   * &order=006
   * &ext=jpg
   * 파라미터에 파일 주소를 넣으면 이미지를 다운로드해서 보여줌. 이유는 아래와 같음.
   * 1. 빠르게 보여주기 위해.(다 다운받으려면 오래걸림)
   * 2. 불펌방지 처리당할 수 있기 때문에.
   */
  @Get('images')
  async load(@Res() res: Response, @Query() query: any) {
    const path = await this.imageService.get(query);
    return res.sendFile(path);
  }
}
