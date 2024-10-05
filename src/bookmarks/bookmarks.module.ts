import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark]), EmbeddingsModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
