import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mapper/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'
import { PrismaQuestionWithDetailsMapper } from '../mapper/prisma-question-with-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: Slug): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug: slug.value },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: Slug): Promise<QuestionWithDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug: slug.value }, // Use the string value of the slug
      select: {
        // Select main Question fields
        id: true,
        title: true,
        slug: true,
        content: true,
        bestAnswerId: true, // Prisma returns the raw ID (string or null)
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
            answers: true,
          },
        },
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionWithDetailsMapper.toDomain(question)
  }

  async fetchManyRecent({
    page,
    perPage,
  }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await this.prisma.question.update({
      where: { id: question.id.toValue() },
      data,
    })

    await this.questionAttachmentsRepository.save(question.attachments)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    })
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
