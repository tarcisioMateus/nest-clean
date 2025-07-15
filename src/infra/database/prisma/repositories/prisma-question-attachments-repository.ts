import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }

  create(questionAttachments: QuestionAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(questionAttachmentList: QuestionAttachmentList): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
