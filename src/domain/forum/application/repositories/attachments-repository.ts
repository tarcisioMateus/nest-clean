import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
  abstract deleteById(id: string): Promise<void>
  abstract findManyByIds(ids: string[]): Promise<Attachment[]>
}
