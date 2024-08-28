import { Injectable } from '@nestjs/common';
import { ClaudeService } from '@/integrations/claude/claude.service';

@Injectable()
export class LLMService {
  constructor(private claudeService: ClaudeService) {}

  async generateResponse(prompt: string): Promise<string> {
    return this.claudeService.generateMessage(prompt);
  }

  // TODO: correct type
  async streamResponse(prompt: string): Promise<any> {
    return this.claudeService.generateMessageStream(prompt);
  }
}
