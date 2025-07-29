import { QuestionsRepository } from '../repositories/questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { QuestionWithDetails } from '../../enterprise/entities/value-objects/question-with-details'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    details: QuestionWithDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(
      Slug.create(slug),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      details: question,
    })
  }
}
