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
export class Post {
  @PrimaryGeneratedColumn('uuid')
  seq: string;

  @Index()
  @Column({ nullable: true })
  code: string;

  @Index()
  @Column({ nullable: true })
  status: number;

  @Column({ nullable: true })
  takenAt: number;

  @Column({ nullable: true })
  pk: string;

  @Column({ nullable: true, type: 'text' })
  text: string;

  @Column({ nullable: true })
  mediaType: number;

  @Column({ nullable: true })
  order: number;

  @Index()
  @Column({ nullable: true })
  username: string;

  @Index()
  @Column({ nullable: true })
  userSeq: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
