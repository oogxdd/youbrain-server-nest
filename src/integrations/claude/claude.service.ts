import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeService {
  private anthropic: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get('CLAUDE_API_KEY'),
    });
  }

  async generateMessage(prompt: string): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024 * 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    return this.extractTextContent(response.content);
  }

  // async generateMessage(prompt: string): Promise<string> {
  //   const response = await this.anthropic.messages.create({
  //     // model: 'claude-3-5-sonnet-20240620',
  //     // max_tokens: 1024 * 8,
  //     model: 'claude-3-haiku-20240307',
  //     max_tokens: 1024 * 0.5,
  //     messages: [{ role: 'user', content: prompt }],
  //   });
  //   // Extract text from the response content
  //   const textContent = response.content
  //     .filter((block) => block.type === 'text')
  //     .map((block) => (block.type === 'text' ? block.text : ''))
  //     .join('\n');

  //   return textContent;
  // }

  async *generateStreamingMessage(prompt: string): AsyncGenerator<string> {
    const stream = await this.anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024 * 0.5,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text') {
        console.log(chunk);
        yield chunk.delta.text;
      }
    }
  }

  private extractTextContent(content: Anthropic.ContentBlock[]): string {
    return content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
  }
}
