import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mapper/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'asc' },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async delete(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    })
  }

  async create(questionAttachments: QuestionAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(questionAttachmentList: QuestionAttachmentList): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
