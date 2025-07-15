import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerID: undefined,
        slug: Slug.create(raw.slug),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
