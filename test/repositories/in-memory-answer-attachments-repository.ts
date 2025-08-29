import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(
    private readonly attachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachment = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return attachment
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items.map(async (item) => {
      if (item.answerId.toString() === answerId) {
        await this.attachmentsRepository.deleteById(item.id.toString())
      }
    })
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...answerAttachments)
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    for (const attachment of answerAttachments) {
      const attachmentIndex = this.items.findIndex(
        (item) => item.id.toValue() === attachment.id.toValue(),
      )

      await this.attachmentsRepository.deleteById(attachment.id.toString())
      this.items.splice(attachmentIndex, 1)
    }
  }

  async save(answerAttachmentList: AnswerAttachmentList): Promise<void> {
    await this.createMany(answerAttachmentList.getNewItems())

    await this.deleteMany(answerAttachmentList.getRemovedItems())
  }
}
