import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { DeleteFile } from '@/domain/forum/application/storage/delete-file'

@Module({
  providers: [
    { provide: Uploader, useClass: R2Storage },
    { provide: DeleteFile, useClass: R2Storage },
  ],
  exports: [Uploader, DeleteFile],
})
export class StorageModule {}
