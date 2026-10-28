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
export class Queue {
  @PrimaryGeneratedColumn()
  seq: number;

  @Index()
  @Column({ nullable: true })
  mode: string;

  @Index()
  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  maxId: string;

  @Column({ nullable: true, default: true })
  loop: boolean;

  @Column({ nullable: true, default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
