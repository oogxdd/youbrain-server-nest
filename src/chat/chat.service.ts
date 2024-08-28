import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
import { LLMService } from '@/ai/llm/llm.service';
import { formatTimestamp } from '@/utils';

@Injectable()
export class ChatService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private llmService: LLMService,
    private eventEmitter: EventEmitter2,
  ) {}

  async processQuestion(
    question: string,
    stream: boolean = false,
  ): Promise<any> {
    try {
      const embedding =
        await this.embeddingsService.generateEmbeddings(question);
      const queryResponse =
        await this.embeddingsService.queryEmbeddings(embedding);

      if (stream) {
        return this.structureResults(question, queryResponse);
      } else {
        const prompt = this.buildPrompt(question, queryResponse);
        return this.llmService.generateResponse(prompt);
      }
    } catch (error) {
      console.error('Error processing chat request:', error);
      throw new Error('An error occurred while processing your request.');
    }
  }

  getStreamMessages(): Observable<string> {
    return new Observable((observer) => {
      const listener = (message: string) => {
        observer.next(message);
      };
      this.eventEmitter.on('streamMessage', listener);
      return () => this.eventEmitter.off('streamMessage', listener);
    });
  }

  private structureResults(question: string, queryResponse: any[]): void {
    const context = queryResponse.map((match) => ({
      text: match.metadata.paragraphText,
      videoTitle: match.metadata.videoTitle,
      youtubeId: match.metadata.youtubeId,
      timestamp: match.metadata.paragraphStart,
    }));
    const prompt = this.buildPrompt(question, context);
    this.llmService.streamResponse(prompt, this.eventEmitter);
  }

  private buildPrompt(question: string, context: any[]): string {
    return `You are an AI assistant for a knowledge base built from YouTube videos, including lectures, talks, and various educational content. A user has asked the following question:
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
  }
}
// import { Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
// import { LLMService } from '@/ai/llm/llm.service';

// import { formatTimestamp } from '@/utils';

// @Injectable()
// export class ChatService {
//   constructor(
//     private embeddingsService: EmbeddingsService,
//     private llmService: LLMService,
//   ) {}

//   async processQuestion(question: string): Promise<Observable<string>> {
//     try {
//       const embedding =
//         await this.embeddingsService.generateEmbeddings(question);
//       const queryResponse =
//         await this.embeddingsService.queryEmbeddings(embedding);
//       return this.structureResults(question, queryResponse);
//     } catch (error) {
//       console.error('Error processing chat request:', error);
//       throw new Error('An error occurred while processing your request.');
//     }
//   }

//   private structureResults(
//     question: string,
//     queryResponse: any[],
//   ): Observable<string> {
//     const context = queryResponse.map((match) => ({
//       text: match.metadata.paragraphText,
//       videoTitle: match.metadata.videoTitle,
//       youtubeId: match.metadata.youtubeId,
//       timestamp: match.metadata.paragraphStart,
//     }));

//     const prompt = this.buildPrompt(question, context);
//     return this.llmService.streamResponse(prompt);
//   }

//   private buildPrompt(question: string, context: any[]): string {
//     return `You are an AI assistant for a knowledge base built from YouTube videos, including lectures, talks, and various educational content. A user has asked the following question:
// Question: "${question}"
// I have found the following relevant information from our video database:
// ${context
//   .map(
//     (c) => `
// Video: "${c.videoTitle}" (YouTube ID: ${c.youtubeId})
// Timestamp: ${formatTimestamp(c.timestamp)}
// Content: "${c.text}"
// `,
//   )
//   .join('\n')}
// Please provide a response that:
// 1. Summarizes the key points relevant to the user's question based on the given context.
// 2. References specific videos and timestamps where the information was found.
// 3. If the context doesn't contain enough relevant information to fully answer the question, acknowledge this and suggest what kind of additional information might be needed.
// Format your response in a clear, structured manner, using markdown for better readability. Include a "References" section at the end that lists the relevant videos with their titles, YouTube IDs, and timestamps.`;
//   }
// }
