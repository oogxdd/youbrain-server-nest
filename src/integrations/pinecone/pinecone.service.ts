import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private pinecone: Pinecone;

  constructor(private readonly configService: ConfigService) {
    this.pinecone = new Pinecone({
      apiKey: this.configService.get('PINECONE_API_KEY'),
    });
  }

  async queryIndex(embedding: number[], indexName: string): Promise<any[]> {
    const index = this.pinecone.index(indexName);
    const queryResponse = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });
    return queryResponse.matches;
  }
}
