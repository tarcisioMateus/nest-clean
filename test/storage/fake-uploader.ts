import {
  DeleteFile,
  deleteFileParams,
} from '@/domain/forum/application/storage/delete-file'
import {
  Uploader,
  uploadParams,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'node:crypto'

interface UploadType {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader, DeleteFile {
  public items: UploadType[] = []

  async upload({ fileName }: uploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.items.push({
      fileName,
      url,
    })

    return { url }
  }

  async deleteFile({ url }: deleteFileParams): Promise<void> {
    this.items = this.items.filter((item) => item.url !== url)
  }
}
