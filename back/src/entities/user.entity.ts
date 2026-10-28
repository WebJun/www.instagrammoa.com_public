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
export class User {
  @PrimaryGeneratedColumn('uuid')
  seq: string;

  @Index()
  @Column({ nullable: true })
  username: string;

  @Index()
  @Column({ nullable: true })
  status: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  feedCount: number; // edge_owner_to_timeline_media.count

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  pk: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true })
  isPrivate: boolean;

  @Column({ nullable: true })
  isVerified: boolean;

  @Column({ nullable: true })
  isBusinessAccount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
