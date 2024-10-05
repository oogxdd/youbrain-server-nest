import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { UpdateBookmarkDto } from './dtos/update-bookmark.dto';
import { JwtAuthGuard } from '@/users/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Request() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(req.user.userId, createBookmarkDto);
  }

  @Get()
  findAll(@Request() req) {
    console.log('req.user.userId');
    console.log(req.user.userId);
    return this.bookmarksService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bookmarksService.findOne(req.user.userId, id);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(req.user.userId, id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bookmarksService.remove(req.user.userId, id);
  }
}
