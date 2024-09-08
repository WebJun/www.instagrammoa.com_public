import { Expose } from 'class-transformer';

export class SearchResponseDto {
  @Expose()
  mode: string;

  @Expose()
  key: string;

  @Expose()
  seq: string;

  @Expose()
  status: number;
}
