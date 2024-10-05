import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';

import { UsersModule } from '@/users/users.module';
import { BookmarksModule } from '@/bookmarks/bookmarks.module';
import { VideoModule } from '@/video/video.module';
import { ChatModule } from '@/chat/chat.module';

import { LLMModule } from '@/ai/llm/llm.module';
import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { TTSModule } from '@/ai/tts/tts.module';

import { OpenAIModule } from '@/integrations/openai/openai.module';
import { ClaudeModule } from '@/integrations/claude/claude.module';
import { PineconeModule } from '@/integrations/pinecone/pinecone.module';
import { DeepgramModule } from '@/integrations/deepgram/deepgram.module';
import { HasuraModule } from '@/integrations/hasura/hasura.module';
import { DigitalOceanModule } from '@/integrations/digitalocean/digitalocean.module';

import config from './@config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    EventEmitterModule.forRoot(),

    UsersModule,
    BookmarksModule,
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
