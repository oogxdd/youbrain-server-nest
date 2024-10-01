import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
import { LLMService } from '@/ai/llm/llm.service';

@Injectable()
export class ChatService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private llmService: LLMService,
  ) {}

  async processQuestion(question: string, res: Response) {
    try {
      const embedding =
        await this.embeddingsService.generateEmbeddings(question);
      const queryResponse =
        await this.embeddingsService.queryEmbeddings(embedding);

      this.sendSSEMessage(res, { type: 'queryResponse', data: queryResponse });

      const prompt = this.buildPrompt(question, queryResponse);

      for await (const chunk of this.llmService.generateStreamingResponse(
        prompt,
      )) {
        this.sendSSEMessage(res, { type: 'llmResponse', data: chunk });
      }

      res.write('event: complete\ndata: Stream completed\n\n');
    } catch (error) {
      console.error('Error in processQuestion:', error);
      this.sendSSEMessage(res, {
        type: 'error',
        data: 'An error occurred while processing your request.',
      });
    } finally {
      res.end();
    }
  }

  private sendSSEMessage(res: Response, message: { type: string; data: any }) {
    res.write(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
  }

  private buildPrompt(question: string, queryResponse: any[]): string {
    const context = queryResponse.map((match, index) => ({
      text: match.metadata.paragraphText,
      videoTitle: match.metadata.videoTitle,
      youtubeId: match.metadata.youtubeId,
      timestamp: match.metadata.paragraphStart,
      index: index,
    }));

    return `You are an AI assistant for a personal knowledge base. A user has asked the following question:
Question: "${question}"

I have found the following relevant information from the user's knowledge base:
${context
  .map(
    (c) => `
[${c.index}] Source: "${c.videoTitle}" (ID: ${c.youtubeId})
Timestamp: ${c.timestamp}
Content: "${c.text}"
`,
  )
  .join('\n')}

Please provide a response that:
1. Answers the question using ONLY the information provided above.
2. Cites sources for every piece of information using the format [X]{Y}, where X is the citation number (starting from 1) and Y is the index of the source in the context provided (starting from 0).
3. Does not use any external knowledge or information not present in the given context.
4. Avoids using the same citation source multiple times, especially for adjacent pieces of information. Try to use a diverse range of sources.
5. If multiple sources provide similar information, choose the most relevant or detailed one for citation.
6. If the context doesn't contain enough relevant information to fully answer the question, provide the best possible answer with the available information without mentioning any limitations or suggesting additional information that might be needed.
7. Does not include any disclaimers about the completeness of the information or suggest that additional information would be beneficial.

Format your response in a clear, structured manner. Do not include a separate references section, as the citations will be inline.

Example of how to use citations:
"To start a startup, you need a cofounder [1]{2} and an idea [2]{4}. It's important to choose your cofounder carefully [3]{7}."

Remember, only use the information provided in the context above to answer the question, and strive for diversity in your citations.`;
  }
}
