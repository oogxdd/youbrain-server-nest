import { Controller, Post, Body, Sse, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('hi')
  async hi() {
    return { hi: true };
  }

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    const response = await this.chatService.processQuestion(body.question);
    return { response };
  }
}
