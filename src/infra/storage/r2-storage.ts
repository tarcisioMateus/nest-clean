import { Injectable } from '@nestjs/common'
import {
  Uploader,
  uploadParams,
} from '@/domain/forum/application/storage/uploader'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import {
  DeleteFile,
  deleteFileParams,
} from '@/domain/forum/application/storage/delete-file'

@Injectable()
export class R2Storage implements Uploader, DeleteFile {
  private client: S3Client

  constructor(private readonly env: EnvService) {
    const accountId = this.env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: this.env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    body,
    fileName,
    fileType,
  }: uploadParams): Promise<{ url: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    )

    return { url: uniqueFileName }
  }

  async deleteFile({ url: uniqueFileName }: deleteFileParams): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.env.get('AWS_BUCKET_NAME'),
          Key: uniqueFileName,
        }),
      )
    } catch (error) {
      console.error(`Error deleting file: ${uniqueFileName}`, error)
      throw error
    }
  }
}
