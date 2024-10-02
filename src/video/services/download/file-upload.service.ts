import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  async saveFile(file: Express.Multer.File): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filePath = path.join(this.uploadDir, file.originalname);
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      console.log(`Successfully deleted ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}
