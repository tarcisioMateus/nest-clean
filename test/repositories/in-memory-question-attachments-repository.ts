import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return attachment
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
  }

  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...questionAttachments)
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    for (const attachment of questionAttachments) {
      const attachmentIndex = this.items.findIndex(
        (item) => item.id.toValue() === attachment.id.toValue(),
      )

      this.items.splice(attachmentIndex, 1)
    }
  }

  async save(questionAttachmentList: QuestionAttachmentList): Promise<void> {
    await this.createMany(questionAttachmentList.getNewItems())

    await this.deleteMany(questionAttachmentList.getRemovedItems())
  }
}
