import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { LLMModule } from '@/ai/llm/llm.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EmbeddingsModule,
    LLMModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '100d' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
