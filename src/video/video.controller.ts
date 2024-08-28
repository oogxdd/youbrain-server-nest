import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  // UploadedFile,
  // UploadedFiles,
  // ParseFilePipe,
  // MaxFileSizeValidator,
  // FileTypeValidator,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from '@/video/video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadVideo(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }), // 100MB
  //         new FileTypeValidator({ fileType: 'video/*' }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.videoService.uploadAndProcessVideo(file);
  // }

  // @Post('upload-multiple')
  // @UseInterceptors(FileInterceptor('files'))
  // async uploadMultipleVideos(
  //   @UploadedFiles(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 100 }), // 100MB
  //         new FileTypeValidator({ fileType: 'video/*' }),
  //       ],
  //     }),
  //   )
  //   files: Array<Express.Multer.File>,
  // ) {
  //   return this.videoService.uploadAndProcessVideos(files);
  // }

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

  // @Post('process')
  // async processVideo(@Body('videoUrl') videoUrl: string) {
  //   return this.videoService.processVideo(videoUrl);
  // }
}
