import { Injectable } from '@nestjs/common';
import { OpenAIService } from '@/integrations/openai/openai.service';
import { PineconeService } from '@/integrations/pinecone/pinecone.service';

@Injectable()
export class EmbeddingsService {
  constructor(
    private openaiService: OpenAIService,
    private pineconeService: PineconeService,
  ) {}

  async generateEmbeddings(text: string): Promise<number[]> {
    return this.openaiService.generateEmbeddings(text);
  }

  async queryEmbeddings(embedding: number[]): Promise<any[]> {
    return this.pineconeService.queryIndex(embedding, 'video-transcripts');
  }
}
