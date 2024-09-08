import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class FileRequestDto {
  @IsString()
  @IsNotEmpty()
  mode: string;

  @IsString()
  @IsNotEmpty()
  seq: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;
}
