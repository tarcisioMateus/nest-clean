import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  create(answerAttachments: AnswerAttachment[]): Promise<void>
  save(answerAttachmentList: AnswerAttachmentList): Promise<void>
  delete(answerId: string): Promise<void>
}
