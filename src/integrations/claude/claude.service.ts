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
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024 * 2,
      messages: [{ role: 'user', content: prompt }],
    });

    // return response.content[0].text;

    // Extract text from the response content
    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return textContent;
  }

  async generateMessageStream(prompt: string) {
    return this.anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024 * 4,
      messages: [{ role: 'user', content: prompt }],
    });
  }
}
