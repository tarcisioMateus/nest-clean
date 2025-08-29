import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

  async deleteById(id: string): Promise<void> {
    const attachmentIndex = this.items.findIndex(
      (item) => item.id.toValue() === id,
    )

    this.items.splice(attachmentIndex, 1)
  }

  async findManyByIds(ids: string[]): Promise<Attachment[]> {
    const attachments = ids.map((id) => {
      return this.items.find((item) => item.id.toString() === id)
    })

    return attachments.filter(
      (attachment): attachment is Attachment => attachment !== undefined,
    )
  }
}
