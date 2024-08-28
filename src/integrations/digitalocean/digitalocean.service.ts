import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

@Injectable()
export class DigitalOceanService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const spacesEndpoint = new URL('https://fra1.digitaloceanspaces.com');
    this.s3Client = new S3Client({
      endpoint: spacesEndpoint.href,
      region: 'us-east-1', // DigitalOcean Spaces use this region
      credentials: {
        accessKeyId: this.configService.get<string>('DO_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('DO_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string = 'application/octet-stream',
  ): Promise<string> {
    const params = {
      Bucket: this.configService.get<string>('DO_BUCKET_NAME'),
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read, // Use the enum value here
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return `https://${this.configService.get<string>('DO_BUCKET_NAME')}.fra1.digitaloceanspaces.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to DigitalOcean Spaces:', error);
      throw new Error('Failed to upload file to DigitalOcean Spaces');
    }
  }
}
