import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }

  create(answerAttachments: AnswerAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(answerAttachmentList: AnswerAttachmentList): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
