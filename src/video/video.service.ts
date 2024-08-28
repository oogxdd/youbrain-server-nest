import { Injectable } from '@nestjs/common';
// import { TTSService } from '@/ai/tts/tts.service';

@Injectable()
export class VideoService {
  constructor() {} // private readonly ttsService: TTSService

  async testFunc() {
    return { ok: 'hi' };
  }

  // async uploadAndProcessVideo(videoFile: Buffer, fileName: string, callbackUrl: string): Promise<string> {
  //   // Upload video to DigitalOcean Spaces
  //   const videoUrl = await this.digitalOceanService.uploadFile(videoFile, fileName);

  //   // Start transcription process with Deepgram
  //   await this.deepgramService.transcribeAudio(videoUrl, callbackUrl);

  //   return videoUrl;
  // }

  // async handleTranscriptionCallback(@Body() callbackData: any) {
  //   // Assuming the transcript is in callbackData.results.channels[0].alternatives[0].transcript
  //   const transcript = callbackData.results.channels[0].alternatives[0].transcript;

  //   // Process the transcription
  //   // await this.aiService.processTranscription(transcript);

  //   return { message: 'Transcription processed successfully' };
  // }

  // async processTranscription(transcript: string, videoId: string): Promise<void> {
  //   // Process the transcription using the EmbeddingService
  //   await this.embeddingService.processTranscription(transcript, videoId);
  // }
}
