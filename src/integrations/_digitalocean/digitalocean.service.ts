// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';

// @Injectable()
// export class DigitalOceanService {
//   private s3: S3;

//   constructor() {
//     this.s3 = new S3({
//       endpoint: process.env.DIGITALOCEAN_SPACES_ENDPOINT,
//       accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY,
//       secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET,
//     });
//   }

//   async uploadFile(file: Buffer, fileName: string): Promise<string> {
//     try {
//       const params = {
//         Bucket: process.env.DIGITALOCEAN_SPACES_NAME,
//         Key: fileName,
//         Body: file,
//         ACL: 'public-read',
//       };

//       const result = await this.s3.upload(params).promise();
//       return result.Location;
//     } catch (error) {
//       console.error('Error uploading file to DigitalOcean:', error);
//       throw new Error('Failed to upload file');
//     }
//   }
// }
