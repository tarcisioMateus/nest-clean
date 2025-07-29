import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerWithDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-with-details'
import { Prisma } from '@prisma/client'

type PrismaAnswerQueryResult = Prisma.AnswerGetPayload<{
  select: {
    id: true
    content: true
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
      }
    }
  }
}>

export class PrismaAnswerWithDetailsMapper {
  static toDomain(raw: PrismaAnswerQueryResult): AnswerWithDetails {
    return AnswerWithDetails.create({
      answer: {
        id: new UniqueEntityID(raw.id),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
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
