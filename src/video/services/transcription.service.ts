import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
import {
  extractParagraphsFromTranscript,
  mergeSameSpeakerUtterances,
} from '@/@utils';

@Injectable()
export class TranscriptionService {
  constructor(private embeddingsService: EmbeddingsService) {}

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

  async generateEmbeddingsForTranscript(transcript: any, videoMetadata: any) {
    const paragraphs = extractParagraphsFromTranscript(transcript);
    const records = [];

    for (const paragraph of paragraphs) {
      const embedding = await this.embeddingsService.generateEmbeddings(
        paragraph.text,
      );

      records.push({
        id: `${videoMetadata.id}_${paragraph.start}`,
        values: embedding,
        metadata: {
          videoId: videoMetadata.id,
          videoTitle: videoMetadata.title,
          youtubeId: videoMetadata.youtube_id,
          paragraphStart: paragraph.start,
          paragraphEnd: paragraph.end,
          paragraphText: paragraph.text,
          speaker: paragraph.speaker,
        },
      });

      // Upsert in batches of 100
      if (records.length >= 100) {
        console.log('embeddings inserted');
        await this.embeddingsService.upsertEmbeddings(records);
        records.length = 0;
      }
    }

    // Upsert any remaining records
    if (records.length > 0) {
      await this.embeddingsService.upsertEmbeddings(records);
    }

    return { finish: true };
  }
}
