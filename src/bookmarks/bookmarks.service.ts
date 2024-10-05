import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { UpdateBookmarkDto } from './dtos/update-bookmark.dto';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    private embeddingsService: EmbeddingsService,
  ) {}

  async create(
    userId: string,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = this.bookmarksRepository.create({
      ...createBookmarkDto,
      user: { userId },
    });
    const savedBookmark = await this.bookmarksRepository.save(bookmark);

    // Generate and upsert embedding
    await this.generateAndUpsertEmbedding(savedBookmark);

    return savedBookmark;
  }

  async findAll(userId: string): Promise<Bookmark[]> {
    return this.bookmarksRepository.find({
      where: { user: { userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Bookmark> {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { id, user: { userId } },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    return bookmark;
  }

  async update(
    userId: string,
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<Bookmark> {
    // TODO: update embeddings here
    const bookmark = await this.findOne(userId, id);
    Object.assign(bookmark, updateBookmarkDto);
    return this.bookmarksRepository.save(bookmark);
  }

  async remove(userId: string, id: string): Promise<void> {
    const bookmark = await this.findOne(userId, id);
    await this.bookmarksRepository.remove(bookmark);
  }

  private async generateAndUpsertEmbedding(bookmark: Bookmark) {
    console.log(bookmark);
    console.log(bookmark.content);
    const embedding = await this.embeddingsService.generateEmbeddings(
      bookmark.content,
    );
    console.log(embedding);
    await this.embeddingsService.upsertEmbeddings([
      {
        id: `bookmark_${bookmark.id}`,
        values: embedding,
        metadata: {
          bookmarkId: bookmark.id,
          content: bookmark.content,
          reference: bookmark.reference,
          userId: bookmark.user.userId,
        },
      },
    ]);
  }
}
