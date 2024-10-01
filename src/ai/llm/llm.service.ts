import { Injectable } from '@nestjs/common';
import { ClaudeService } from '@/integrations/claude/claude.service';

@Injectable()
export class LLMService {
  constructor(private claudeService: ClaudeService) {}

  async generateResponse(prompt: string): Promise<string> {
    return this.claudeService.generateMessage(prompt);
  }

  async *generateStreamingResponse(prompt: string): AsyncGenerator<string> {
    yield* this.claudeService.generateStreamingMessage(prompt);
  }
}
