import { Module } from '@nestjs/common';
import { OpenAIModule } from '@/integrations/openai/openai.module';
import { PineconeModule } from '@/integrations/pinecone/pinecone.module';
import { EmbeddingsService } from './embeddings.service';

@Module({
  imports: [OpenAIModule, PineconeModule],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
