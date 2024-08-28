// import { Injectable } from '@nestjs/common';
// import { Deepgram } from '@deepgram/sdk';

// @Injectable()
// export class DeepgramService {
//   private deepgram: Deepgram;

//   constructor() {
//     this.deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
//   }

//   async requestTranscription(audioUrl: string): Promise<string> {
//     try {
//       const response = await this.deepgram.transcription.preRecorded(
//         { url: audioUrl },
//         { punctuate: true, model: 'general' }
//       );
//       return response.results.channels[0].alternatives[0].transcript;
//     } catch (error) {
//       console.error('Error requesting transcription from Deepgram:', error);
//       throw new Error('Failed to transcribe audio');
//     }
//   }

//   async requestAsyncTranscription(audioUrl: string, callbackUrl: string): Promise<string> {
//     try {
//       const response = await this.deepgram.transcription.preRecorded(
//         { url: audioUrl },
//         {
//           punctuate: true,
//           model: 'general',
//           callback: callbackUrl
//         }
//       );
//       return response.request_id;
//     } catch (error) {
//       console.error('Error requesting async transcription from Deepgram:', error);
//       throw new Error('Failed to request async transcription');
//     }
//   }
// }
