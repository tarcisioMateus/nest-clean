import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerAttachmentMapper } from '../mapper/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'asc' },
    })

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { answerId },
    })
  }

  async createMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length) {
      const attachmentsId = answerAttachments.map((attachment) =>
        attachment.attachmentId.toString(),
      )

      await this.prisma.attachment.updateMany({
        where: {
          id: {
            in: attachmentsId,
          },
        },
        data: {
          answerId: answerAttachments[0].answerId.toString(),
        },
      })
    }
  }

  async deleteMany(answerAttachments: AnswerAttachment[]): Promise<void> {
    if (answerAttachments.length) {
      const attachmentsId = answerAttachments.map((attachment) =>
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

  async save(answerAttachmentList: AnswerAttachmentList): Promise<void> {
    await this.createMany(answerAttachmentList.getNewItems())
    await this.deleteMany(answerAttachmentList.getRemovedItems())
  }
}
