import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';

import { ChatModule } from '@/chat/chat.module';
import { VideoModule } from '@/video/video.module';

import { LLMModule } from '@/ai/llm/llm.module';
import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { TTSModule } from '@/ai/tts/tts.module';

import { OpenAIModule } from '@/integrations/openai/openai.module';
import { ClaudeModule } from '@/integrations/claude/claude.module';
import { PineconeModule } from '@/integrations/pinecone/pinecone.module';
import { DeepgramModule } from '@/integrations/deepgram/deepgram.module';
import { HasuraModule } from '@/integrations/hasura/hasura.module';
import { DigitalOceanModule } from '@/integrations/digitalocean/digitalocean.module';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    EventEmitterModule.forRoot(),

    VideoModule,
    ChatModule,

    LLMModule,
    EmbeddingsModule,
    TTSModule,

    OpenAIModule,
    ClaudeModule,
    PineconeModule,
    DeepgramModule,
    HasuraModule,
    DigitalOceanModule,
  ],
})
export class AppModule {}
