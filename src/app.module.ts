import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChatModule } from '@/chat/chat.module';
import { VideoModule } from '@/video/video.module';

import { LLMModule } from '@/ai/llm/llm.module';
import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { TTSModule } from '@/ai/tts/tts.module';

import { OpenAIModule } from '@/integrations/openai/openai.module';
import { ClaudeModule } from '@/integrations/claude/claude.module';
import { PineconeModule } from '@/integrations/pinecone/pinecone.module';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    VideoModule,
    ChatModule,

    LLMModule,
    EmbeddingsModule,
    TTSModule,

    OpenAIModule,
    ClaudeModule,
    PineconeModule,
  ],
})
export class AppModule {}
