import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract create(answerAttachments: AnswerAttachment[]): Promise<void>
  abstract save(answerAttachmentList: AnswerAttachmentList): Promise<void>
  abstract delete(answerId: string): Promise<void>
}
