import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerID: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    question: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toValue(),
      authorId: question.authorId.toValue(),
      bestAnswerId: question.bestAnswerId?.toValue(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
