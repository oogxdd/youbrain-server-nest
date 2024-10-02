import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dtos/create-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('process-youtube')
  async processYoutubeVideo(@Body('youtubeId') youtubeId: string) {
    try {
      const result = await this.videoService.processYoutubeVideo(youtubeId);
      return result;
    } catch (error) {
      console.error('Error in processYoutubeVideo:', error);
      throw new HttpException(
        'Failed to process YouTube video',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('callback/:videoId')
  async handleTranscriptionCallback(
    @Body() body: any,
    @Param('videoId') videoId: string,
  ) {
    try {
      const result = await this.videoService.handleTranscriptionCallback(
        body,
        videoId,
      );
      return { message: result };
    } catch (error) {
      console.error('Error in handleTranscriptionCallback:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadVideo(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createVideoDto: CreateVideoDto,
  // ) {
  //   return this.videoService.uploadAndProcessVideo(file, createVideoDto);
  // }
}
