import { Injectable } from '@nestjs/common';
import { mergeSameSpeakerUtterances } from '@/utils';

@Injectable()
export class TranscriptionService {
  processTranscriptionResults(results: any, metadata: any) {
    const lineBreaks =
      results.channels[0].alternatives[0].paragraphs.paragraphs.map(
        (i) => i.start,
      );
    const utterances = mergeSameSpeakerUtterances(results.utterances);

    return {
      utterances,
      lineBreaks,
      paragraphs: results.channels[0].alternatives[0].paragraphs.paragraphs.map(
        (paragraph) => ({
          start: paragraph.start,
          end: paragraph.end,
          text: paragraph.sentences.map((sentence) => sentence.text).join(' '),
        }),
      ),
      duration: metadata.duration,
    };
  }
}
