import { Injectable } from '@nestjs/common';
import { DeepgramService } from '@/integrations/deepgram/deepgram.service';

@Injectable()
export class TTSService {
  constructor(private deepgramService: DeepgramService) {}

  async requestTranscription(
    audioFilePath: string,
    videoId: string,
  ): Promise<string> {
    return this.deepgramService.requestTranscription(audioFilePath, videoId);
  }
}
