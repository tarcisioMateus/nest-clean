import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mapper/prisma-answer-mapper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { LoadingParams } from '@/core/repositories/loading-params'
import { AnswerWithDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-with-details'
import { PrismaAnswerWithDetailsMapper } from '../mapper/prisma-answer-with-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: perLoading,
      skip: (loading - 1) * perLoading,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findManyByQuestionIdWithDetails(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<AnswerWithDetails[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      select: {
        // Select main Answer fields
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,

        // Select specific fields for related Attachments
        attachments: {
          select: {
            id: true, // Prisma returns raw ID
            title: true,
            link: true,
          },
        },

        // Select specific fields for related Author
        author: {
          select: {
            id: true, // Prisma returns raw ID
            name: true,
          },
        },

        // Use _count to get the total number of comments and answers
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: perLoading,
      skip: (loading - 1) * perLoading,
    })

    return answers.map(PrismaAnswerWithDetailsMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.create({
      data,
    })

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.update({
      where: { id: answer.id.toValue() },
      data,
    })

    await this.answerAttachmentsRepository.save(answer.attachments)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    })
  }
}
