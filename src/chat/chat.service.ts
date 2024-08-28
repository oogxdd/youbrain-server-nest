import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
import { LLMService } from '@/ai/llm/llm.service';

import { formatTimestamp } from '@/utils';

@Injectable()
export class ChatService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private llmService: LLMService,
  ) {}

  async processQuestion(question: string): Promise<string> {
    try {
      // Generate embedding for the question
      const embedding =
        await this.embeddingsService.generateEmbeddings(question);

      // Query Pinecone
      const queryResponse =
        await this.embeddingsService.queryEmbeddings(embedding);

      // Structure results using Claude
      // const structuredResponse = await this.structureResults(
      //   question,
      //   queryResponse,
      // );

      // return structuredResponse;

      const stream = await this.structureResults(question, queryResponse);

      return new Observable<string>((observer) => {
        stream.on('text', (text: string) => {
          observer.next(text);
        });

        stream.on('end', () => {
          observer.complete();
        });

        stream.on('error', (error: Error) => {
          observer.error(error);
        });

        // Provide a way to cancel the stream
        return () => {
          stream.controller.abort();
        };
      });
    } catch (error) {
      console.error('Error processing chat request:', error);
      throw new Error('An error occurred while processing your request.');
    }
  }

  private async structureResults(question: string, queryResponse: any[]) {
    const context = queryResponse.map((match) => ({
      text: match.metadata.paragraphText,
      videoTitle: match.metadata.videoTitle,
      youtubeId: match.metadata.youtubeId,
      timestamp: match.metadata.paragraphStart,
    }));

    const prompt = `You are an AI assistant for a knowledge base built from YouTube videos, including lectures, talks, and various educational content. A user has asked the following question:
Question: "${question}"
I have found the following relevant information from our video database:
${context
  .map(
    (c) => `
Video: "${c.videoTitle}" (YouTube ID: ${c.youtubeId})
Timestamp: ${formatTimestamp(c.timestamp)}
Content: "${c.text}"
`,
  )
  .join('\n')}
Please provide a response that:
1. Summarizes the key points relevant to the user's question based on the given context.
2. References specific videos and timestamps where the information was found.
3. If the context doesn't contain enough relevant information to fully answer the question, acknowledge this and suggest what kind of additional information might be needed.
Format your response in a clear, structured manner, using markdown for better readability. Include a "References" section at the end that lists the relevant videos with their titles, YouTube IDs, and timestamps.`;

    // return this.llmService.generateResponse(prompt);
    return this.llmService.streamResponse(prompt);
  }
}
