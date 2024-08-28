import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from '@/video/video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('test')
  async testFunc() {
    return this.videoService.testFunc();
  }

  // @Post('process')
  // async processVideo(@Body('videoUrl') videoUrl: string) {
  //   return this.videoService.processVideo(videoUrl);
  // }
}
