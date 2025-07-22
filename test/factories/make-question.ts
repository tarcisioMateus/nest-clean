import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mapper/prisma-question-mapper'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityID,
  ): Promise<Question> {
    const question = makeQuestion(override, id)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    return question
  }
}
