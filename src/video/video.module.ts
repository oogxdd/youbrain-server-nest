import { Module } from '@nestjs/common';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TranscriptionService } from './services/transcription.service';
import { YoutubeService } from './services/download/youtube.service';
import { FileUploadService } from './services/download/file-upload.service';

import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { TTSModule } from '@/ai/tts/tts.module';

import { HasuraModule } from '@/integrations/hasura/hasura.module';
import { DigitalOceanModule } from '@/integrations/digitalocean/digitalocean.module';

@Module({
  imports: [
    EmbeddingsModule,
    TTSModule,
    HasuraModule, // ORM
    DigitalOceanModule, // Storage
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    TranscriptionService,
    YoutubeService,
    FileUploadService,
  ],
})
export class VideoModule {}
