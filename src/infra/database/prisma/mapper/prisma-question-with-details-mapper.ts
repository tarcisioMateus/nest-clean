import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Prisma } from '@prisma/client'

type PrismaQuestionQueryResult = Prisma.QuestionGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    content: true
    bestAnswerId: true
    createdAt: true
    updatedAt: true
    attachments: {
      select: {
        id: true
        title: true
        link: true
      }
    }
    author: {
      select: {
        id: true
        name: true
      }
    }
    _count: {
      select: {
        comments: true
        answers: true
      }
    }
  }
}>

export class PrismaQuestionWithDetailsMapper {
  static toDomain(raw: PrismaQuestionQueryResult): QuestionWithDetails {
    return QuestionWithDetails.create({
      question: {
        id: new UniqueEntityID(raw.id),
        bestAnswerID: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      answers: { length: raw._count.answers, loaded: 0 },
      author: { id: new UniqueEntityID(raw.author.id), name: raw.author.name },
      comments: { length: raw._count.comments },
      attachments: raw.attachments.map((attachment) => {
        return {
          id: new UniqueEntityID(attachment.id),
          title: attachment.title,
          url: attachment.link,
        }
      }),
    })
  }
}
