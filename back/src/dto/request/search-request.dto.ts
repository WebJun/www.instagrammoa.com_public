import { IsString, IsNotEmpty } from 'class-validator';

export class SearchRequestDto {
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
