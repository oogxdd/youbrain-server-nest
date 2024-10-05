import {
  Controller,
  Post,
  Body,
  Sse,
  Get,
  Res,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { Response } from 'express';
import { JwtAuthGuard } from '@/users/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @Get('hi')
  async hi() {
    return { hi: true };
  }

  @Get('stream')
  // @UseGuards(JwtAuthGuard)
  async streamResponse(
    @Request() req,
    @Res() res: Response,
    @Query('question') question: string,
    @Query('token') token: string,
  ) {
    let userId: string;
    console.log('go');

    try {
      const payload = this.jwtService.verify(token);
      userId = payload.sub; // Assuming 'sub' is where you store the userId in your JWT payload
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.chatService.processQuestion(question, res, userId);
  }
}
