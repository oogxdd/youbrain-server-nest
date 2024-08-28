import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  CallbackUrl,
  // Deepgram
} from '@deepgram/sdk';
import * as fs from 'fs';

@Injectable()
export class DeepgramService {
  private deepgram;
  // : Deepgram;

  constructor(private readonly configService: ConfigService) {
    this.deepgram = createClient(this.configService.get('DEEPGRAM_API_KEY'));
  }

  async requestTranscription(
    audioFilePath: string,
    videoId: string,
  ): Promise<string> {
    try {
      const audioUrl = fs.createReadStream(audioFilePath);
      const callbackUrl = new CallbackUrl(
        `${this.configService.get('BASE_URL')}/video/callback/${videoId}`,
      );
      const options = {
        model: 'nova-2',
        smart_format: true,
        diarize: true,
        utterances: true,
        metadata: {
          extra: {
            videoId: videoId,
          },
        },
      };

      const { result, error } =
        await this.deepgram.listen.prerecorded.transcribeFileCallback(
          audioUrl,
          callbackUrl,
          options,
        );

      if (error) throw error;

      console.log('Transcription request submitted:', result);
      return result.request_id;
    } catch (error) {
      console.error('Error in requestTranscription:', error);
      throw error;
    }
  }
}
