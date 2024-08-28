import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { ClaudeModule } from '@/integrations/claude/claude.module';

@Module({
  imports: [ClaudeModule],
  providers: [LLMService],
  exports: [LLMService],
})
export class LLMModule {}
