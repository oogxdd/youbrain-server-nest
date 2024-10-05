import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Bookmark } from '@/bookmarks/entities/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];
}
