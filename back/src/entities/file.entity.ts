import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  seq: string;

  @Column({ nullable: true })
  pk: string;

  @Column({ nullable: true, type: 'text' })
  imageUrl: string;

  @Column({ nullable: true, type: 'text' })
  videoUrl: string;

  @Column({ nullable: true })
  imageLocal: string;

  @Column({ nullable: true })
  videoLocal: string;

  @Column({ nullable: true, default: 0 })
  imageStatus: number;

  @Column({ nullable: true, default: 0 })
  videoStatus: number;

  @Column({ nullable: true })
  takenAt: number;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: true })
  cdn: string;

  @Index()
  @Column({ nullable: true })
  username: string;

  @Index()
  @Column({ nullable: true })
  userSeq: string;

  @Index()
  @Column({ nullable: true })
  code: string;

  @Index()
  @Column({ nullable: true })
  postSeq: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
