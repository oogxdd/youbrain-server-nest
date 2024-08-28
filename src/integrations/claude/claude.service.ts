import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    // Extract text from the response content
    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return textContent;
  }

  generateMessageStream(prompt: string, eventEmitter: EventEmitter2): void {
    const stream = this.anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024 * 5,
      messages: [{ role: 'user', content: prompt }],
    });

    stream.on('text', (text: string) => {
      eventEmitter.emit('streamMessage', text);
    });

    stream.on('end', () => {
      eventEmitter.emit('streamMessage', '[DONE]');
    });

    stream.on('error', (error: Error) => {
      console.error('Stream error:', error);
      eventEmitter.emit('streamMessage', `Error: ${error.message}`);
    });
  }
}

// import { Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { ConfigService } from '@nestjs/config';
// import Anthropic from '@anthropic-ai/sdk';

// @Injectable()
// export class ClaudeService {
//   private anthropic: Anthropic;

//   constructor(private readonly configService: ConfigService) {
//     this.anthropic = new Anthropic({
//       apiKey: this.configService.get('CLAUDE_API_KEY'),
//     });
//   }

//   async generateMessage(prompt: string): Promise<string> {
//     const response = await this.anthropic.messages.create({
//       model: 'claude-3-5-sonnet-20240620',
//       max_tokens: 1024 * 2,
//       messages: [{ role: 'user', content: prompt }],
//     });

//     // return response.content[0].text;

//     // Extract text from the response content
//     const textContent = response.content
//       .filter((block) => block.type === 'text')
//       .map((block) => (block.type === 'text' ? block.text : ''))
//       .join('\n');

//     return textContent;
//   }

//   generateMessageStream(prompt: string): Observable<string> {
//     return new Observable<string>((observer) => {
//       this.anthropic.messages
//         .stream({
//           model: 'claude-3-5-sonnet-20240620',
//           max_tokens: 1024 * 5,
//           messages: [{ role: 'user', content: prompt }],
//         })
//         .on('text', (text: string) => {
//           console.log('text');
//           console.log(text);
//           observer.next(text);
//         })
//         .on('end', () => {
//           console.log('end');
//           observer.complete();
//         })
//         .on('error', (error: Error) => {
//           console.log(error);
//           observer.error(error);
//         });
//     });
//   }
// }
