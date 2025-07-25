import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>

  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  abstract createMany(questionAttachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(questionAttachments: QuestionAttachment[]): Promise<void>
  abstract save(questionAttachmentList: QuestionAttachmentList): Promise<void>
}
