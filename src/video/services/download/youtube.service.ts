import { Injectable, Logger } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  async getVideoInfo(youtubeId: string) {
    try {
      const info = await ytdl.getInfo(
        `https://www.youtube.com/watch?v=${youtubeId}`,
      );
      const format = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio',
      });
      return {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
        format: format,
        channelName: info.videoDetails.author.name,
        channelId: info.videoDetails.channelId,
      };
    } catch (error) {
      this.logger.error(`Error getting video info: ${error.message}`);
      throw error;
    }
  }

  async downloadVideo(
    youtubeId: string,
    format: ytdl.videoFormat,
  ): Promise<string> {
    const downloadDir = path.resolve(process.cwd(), 'downloads');
    console.log(youtubeId);
    const videoPath = path.join(
      downloadDir,
      `${youtubeId}.${format.container}`,
    );

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    this.logger.log(`Starting download for YouTube ID: ${youtubeId}`);
    this.logger.log(`Download path: ${videoPath}`);

    return new Promise((resolve, reject) => {
      const videoStream = ytdl(`https://www.youtube.com/watch?v=${youtubeId}`, {
        format: format,
      });
      const fileStream = fs.createWriteStream(videoPath);

      let downloadedBytes = 0;

      videoStream.on('info', (info, format) => {
        this.logger.log(
          `Video info received. Format: ${format.container}, Quality: ${format.qualityLabel}`,
        );
      });

      videoStream.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        this.logger.log(`Downloaded: ${downloadedBytes} bytes`);
      });

      videoStream.pipe(fileStream);

      fileStream.on('finish', () => {
        this.logger.log(
          `Download completed. Total size: ${downloadedBytes} bytes`,
        );
        resolve(videoPath);
      });

      fileStream.on('error', (error) => {
        this.logger.error(`Error writing to file: ${error.message}`);
        reject(error);
      });

      videoStream.on('error', (error) => {
        this.logger.error(`Error downloading video: ${error.message}`);
        reject(error);
      });
    });
  }

  async deleteVideo(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      this.logger.log(`Successfully deleted ${filePath}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${filePath}:`, error);
    }
  }
}
