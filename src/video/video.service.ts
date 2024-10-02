import { Injectable } from '@nestjs/common';
import { TTSService } from '@/ai/tts/tts.service';
import { HasuraService } from '@/integrations/hasura/hasura.service';
import { YoutubeService } from './services/download/youtube.service';
import { FileUploadService } from './services/download/file-upload.service';
import { TranscriptionService } from './services/transcription.service';
import { CreateVideoDto } from './dtos/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    private hasuraService: HasuraService,
    private ttsService: TTSService,
    private youtubeService: YoutubeService,
    private fileUploadService: FileUploadService,
    private transcriptionService: TranscriptionService,
  ) {}

  async processYoutubeVideo(youtubeId: string) {
    const videoInfo = await this.youtubeService.getVideoInfo(youtubeId);
    console.log(videoInfo);
    const videoId = await this.createVideo(videoInfo);

    try {
      const audioPath = await this.youtubeService.downloadVideo(
        youtubeId,
        videoInfo.format,
      );
      await this.ttsService.requestTranscription(audioPath, videoId);
      await this.updateVideoStatus(videoId, 'processing');
      await this.youtubeService.deleteVideo(audioPath);
      return { videoId, status: 'processing' };
    } catch (error) {
      console.error(`Error processing video ${youtubeId}:`, error);
      await this.updateVideoStatus(videoId, 'error');
      throw error;
    }
  }

  async handleTranscriptionCallback(
    body: any,
    videoId: string,
  ): Promise<string> {
    console.log('Received callback!');
    const { results, metadata } = body;

    const transcriptData =
      this.transcriptionService.processTranscriptionResults(results, metadata);

    await this.saveTranscript(videoId, transcriptData);
    await this.updateVideoStatus(videoId, 'transcribed');

    // Generate and upload embeddings
    const video = await this.getVideoById(videoId);
    await this.transcriptionService.generateEmbeddingsForTranscript(
      video.transcript.transcript_data,
      video,
    );

    return 'Transcript saved and embeddings generated successfully';
  }

  // async uploadAndProcessVideo(
  //   file: Express.Multer.File,
  //   createVideoDto: CreateVideoDto,
  // ) {
  //   const filePath = await this.fileUploadService.saveFile(file);
  //   const videoId = await this.createVideo({
  //     ...createVideoDto,
  //     status: 'uploading',
  //     url: filePath,
  //   });

  //   await this.ttsService.requestTranscription(filePath, videoId);
  //   await this.updateVideoStatus(videoId, 'processing');

  //   return { videoId, filePath };
  // }

  // Implement these methods as needed
  private async createVideo(videoData: any): Promise<string> {
    // Implementation
    return null;
  }

  private async updateVideoStatus(id: string, status: string): Promise<void> {
    // Implementation
    return null;
  }

  private async saveTranscript(
    videoId: string,
    transcriptData: any,
  ): Promise<void> {
    // Implementation
    return null;
  }

  private async getVideoById(id: string): Promise<any> {
    // Implementation
    return null;
  }
}
