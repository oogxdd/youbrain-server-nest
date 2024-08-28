import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClaudeService } from '@/integrations/claude/claude.service';

@Injectable()
export class LLMService {
  constructor(private claudeService: ClaudeService) {}

  async generateResponse(prompt: string): Promise<string> {
    return this.claudeService.generateMessage(prompt);
  }

  streamResponse(prompt: string, eventEmitter: EventEmitter2): void {
    this.claudeService.generateMessageStream(prompt, eventEmitter);
  }
}
