import { Expose } from 'class-transformer';

export class FileResponseDto {
  // @Expose()
  // seq: string;

  // @Expose()
  // pk: string;

  @Expose()
  imageUrl: string;

  @Expose()
  videoUrl: string;

  @Expose()
  imageLocal: string;

  @Expose()
  videoLocal: string;

  @Expose()
  imageStatus: number;

  @Expose()
  videoStatus: number;

  @Expose()
  takenAt: number;

  @Expose()
  order: number;

  @Expose()
  cdn: string;

  @Expose()
  username: string;

  @Expose()
  userSeq: string;

  @Expose()
  code: string;

  @Expose()
  postSeq: string;

  // @Expose()
  // createdAt: Date;

  // @Expose()
  // updatedAt: Date;

  // @Expose()
  // deletedAt: Date;

  @Expose()
  lastPage: boolean;
}
