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
export class Search {
  @PrimaryGeneratedColumn('uuid')
  seq: string;

  @Index()
  @Column({ nullable: true })
  mode: string;

  @Index()
  @Column({ nullable: true })
  key: string;

  @Index()
  @Column({ nullable: true, default: 0 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
