import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { EmbeddingsModule } from '@/ai/embeddings/embeddings.module';
import { LLMModule } from '@/ai/llm/llm.module';

@Module({
  imports: [EmbeddingsModule, LLMModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
