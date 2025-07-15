import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  create(questionAttachments: QuestionAttachment[]): Promise<void>
  save(questionAttachmentList: QuestionAttachmentList): Promise<void>
  delete(questionId: string): Promise<void>
}
