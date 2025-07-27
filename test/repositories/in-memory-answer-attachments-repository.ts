import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachment = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return attachment
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
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

      this.items.splice(attachmentIndex, 1)
    }
  }

  async save(answerAttachmentList: AnswerAttachmentList): Promise<void> {
    await this.createMany(answerAttachmentList.getNewItems())

    await this.deleteMany(answerAttachmentList.getRemovedItems())
  }
}
