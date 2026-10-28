import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ nullable: true, type: 'json' })
  content: string;

  @Index()
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  maxId: string;

  @Column({ nullable: true })
  loop: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
