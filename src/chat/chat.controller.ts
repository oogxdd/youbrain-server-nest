import { Controller, Post, Body, Sse, Get, Res, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('hi')
  async hi() {
    return { hi: true };
  }

  @Get('stream')
  async streamResponse(
    @Res() res: Response,
    @Query('question') question: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.chatService.processQuestion(question, res);
  }
}
