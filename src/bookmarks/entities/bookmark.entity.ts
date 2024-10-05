import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ default: 'note' })
  type: string;

  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
