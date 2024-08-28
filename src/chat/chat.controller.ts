import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    const response = await this.chatService.processQuestion(body.question);
    return { response };
  }
}
