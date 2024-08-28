// import { gql } from 'graphql-request';
import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '@/ai/embeddings/embeddings.service';
import { TTSService } from '@/ai/tts/tts.service';
import { HasuraService } from '@/integrations/hasura/hasura.service';
import { DigitalOceanService } from '@/integrations/digitalocean/digitalocean.service';
import { TranscriptionService } from './transcription.service';
import {
  extractParagraphsFromTranscript,
  // mergeSameSpeakerUtterances,
} from '@/utils';

@Injectable()
export class VideoService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private hasuraService: HasuraService,
    private digitalOceanService: DigitalOceanService,
    private ttsService: TTSService,
    private transcriptionService: TranscriptionService,
  ) {}

  // async uploadAndProcessVideos(files: Express.Multer.File[]) {
  //   const results = [];
  //   for (const file of files) {
  //     const result = await this.uploadAndProcessVideo(file);
  //     results.push(result);
  //   }
  //   return results;
  // }

  async uploadAndProcessVideo(file: any) {
    // Upload video to DigitalOcean Spaces
    const videoUrl = await this.digitalOceanService.uploadFile(
      file.buffer,
      file.originalname,
    );

    // Create video record in database
    const videoId = await this.createVideo({
      title: file.originalname,
      status: 'uploading',
      url: videoUrl,
    });

    // Start transcription process with Deepgram
    await this.ttsService.requestTranscription(videoUrl, videoId);

    // Update video status
    await this.updateVideoStatus(videoId, 'processing');

    return { videoId, videoUrl };
  }

  async handleTranscriptionCallback(
    body: any,
    videoId: string,
  ): Promise<string> {
    console.log('Received callback!');
    const { results, metadata } = body;

    const transcriptData =
      this.transcriptionService.processTranscriptionResults(results, metadata);

    await this.saveTranscript(videoId, transcriptData);
    await this.updateVideoStatus(videoId, 'transcribed');

    // Generate and upload embeddings
    await this.generateEmbeddingsForVideo(videoId);

    return 'Transcript saved and embeddings generated successfully';
  }

  async generateEmbeddingsForVideo(videoId: string) {
    const video = await this.getVideoById(videoId);
    const paragraphs = extractParagraphsFromTranscript(
      video.transcript.transcript_data,
    );

    const records = [];

    // Right now I'm using paragraphs as chunks.
    // Later I might want to pick up better strategy (https://www.pinecone.io/learn/chunking-strategies/)
    for (const paragraph of paragraphs) {
      const embedding = await this.embeddingsService.generateEmbeddings(
        paragraph.text,
      );

      records.push({
        id: `${video.id}_${paragraph.start}`,
        values: embedding,
        metadata: {
          videoId: video.id,
          videoTitle: video.title,
          youtubeId: video.youtube_id,
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

  // Video CRUD operations
  async createVideo(videoData: any): Promise<string> {
    return 'Created video';
    // const mutation = gql`
    //   mutation CreateVideo($input: videos_insert_input!) {
    //     insert_videos_one(object: $input) {
    //       id
    //     }
    //   }
    // `;
    // const result = await this.hasuraService.request(mutation, {
    //   input: videoData,
    // });
    // return result.insert_videos_one.id;
  }

  async getVideoById(id: string): Promise<any> {
    // const query = gql`
    //   query GetVideo($id: uuid!) {
    //     videos_by_pk(id: $id) {
    //       id
    //       title
    //       status
    //       url
    //       youtube_id
    //       transcript {
    //         transcript_data
    //       }
    //     }
    //   }
    // `;
    // const result = await this.hasuraService.request(query, { id });
    // return result.videos_by_pk;
  }

  async updateVideoStatus(id: string, status: string): Promise<void> {
    // const mutation = gql`
    //   mutation UpdateVideoStatus($id: uuid!, $status: String!) {
    //     update_videos_by_pk(
    //       pk_columns: { id: $id }
    //       _set: { status: $status }
    //     ) {
    //       id
    //     }
    //   }
    // `;
    // await this.hasuraService.request(mutation, { id, status });
  }

  async saveTranscript(videoId: string, transcriptData: any): Promise<void> {
    // return 'Saved transcript';
    // const mutation = gql`
    //   mutation SaveTranscript($videoId: uuid!, $transcriptData: jsonb!) {
    //     insert_transcripts_one(
    //       object: { video_id: $videoId, transcript_data: $transcriptData }
    //     ) {
    //       id
    //     }
    //   }
    // `;
    // await this.hasuraService.request(mutation, { videoId, transcriptData });
  }

  // async processYoutubeBatch(youtubeLinks) {
  //   const batchId = await this.hasuraService.createBatch();

  //   for (const link of youtubeLinks) {
  //     const youtubeId = this.youtubeService.extractYoutubeId(link);
  //     const videoInfo = await this.youtubeService.getVideoInfo(youtubeId);
  //     const videoId = await this.hasuraService.createVideo(
  //       batchId,
  //       youtubeId,
  //       videoInfo,
  //     );

  //     try {
  //       const audioPath = await this.youtubeService.downloadVideo(
  //         youtubeId,
  //         videoInfo.format,
  //       );
  //       await this.ttsService.requestTranscription(audioPath, videoId);
  //       await this.hasuraService.updateVideoStatus(videoId, 'processing');
  //       await this.youtubeService.deleteVideo(audioPath);
  //     } catch (error) {
  //       console.error(`Error processing video ${youtubeId}:`, error);
  //       await this.hasuraService.updateVideoStatus(videoId, 'error');
  //     }
  //   }

  //   return batchId;
  // }
}
