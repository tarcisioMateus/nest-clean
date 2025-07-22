import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>

  abstract create(questionAttachments: QuestionAttachment[]): Promise<void>
  abstract save(questionAttachmentList: QuestionAttachmentList): Promise<void>
  abstract delete(questionId: string): Promise<void>
}
