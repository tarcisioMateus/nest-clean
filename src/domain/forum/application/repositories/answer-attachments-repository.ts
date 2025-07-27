import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
  abstract createMany(answerAttachments: AnswerAttachment[]): Promise<void>
  abstract deleteMany(answerAttachments: AnswerAttachment[]): Promise<void>
  abstract save(answerAttachmentList: AnswerAttachmentList): Promise<void>
}
