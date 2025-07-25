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

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    })
  }

  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length) {
      const attachmentsId = questionAttachments.map((attachment) =>
        attachment.attachmentId.toString(),
      )

      await this.prisma.attachment.updateMany({
        where: {
          id: {
            in: attachmentsId,
          },
        },
        data: {
          questionId: questionAttachments[0].questionId.toString(),
        },
      })
    }
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length) {
      const attachmentsId = questionAttachments.map((attachment) =>
        attachment.attachmentId.toString(),
      )

      await this.prisma.attachment.deleteMany({
        where: {
          id: {
            in: attachmentsId,
          },
        },
      })
    }
  }

  async save(questionAttachmentList: QuestionAttachmentList): Promise<void> {
    await this.createMany(questionAttachmentList.getNewItems())
    await this.deleteMany(questionAttachmentList.getRemovedItems())
  }
}
