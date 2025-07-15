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

  async create(questionAttachments: QuestionAttachment[]): Promise<void> {
    for (const attachment of questionAttachments) {
      this.items.push(attachment)
    }
  }

  async save(questionAttachmentList: QuestionAttachmentList): Promise<void> {
    for (const attachment of questionAttachmentList.getNewItems()) {
      this.items.push(attachment)
    }

    for (const attachment of questionAttachmentList.getRemovedItems()) {
      const attachmentIndex = this.items.findIndex(
        (item) => item.id.toValue() === attachment.id.toValue(),
      )

      this.items.splice(attachmentIndex, 1)
    }
  }

  async delete(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )
  }
}
