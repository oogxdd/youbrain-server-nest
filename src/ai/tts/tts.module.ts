import { Module } from '@nestjs/common';
import { TTSService } from './tts.service';
import { DeepgramModule } from '@/integrations/deepgram/deepgram.module';

@Module({
  imports: [DeepgramModule],
  providers: [TTSService],
  exports: [TTSService],
})
export class TTSModule {}
