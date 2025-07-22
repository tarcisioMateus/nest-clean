import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mapper/prisma-question-comment-mapper'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questionComment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionComment(
    override: Partial<QuestionCommentProps> = {},
    id?: UniqueEntityID,
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(override, id)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistence(questionComment),
    })

    return questionComment
  }
}
