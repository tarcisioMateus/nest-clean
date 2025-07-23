import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import {
  PaginationParams,
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '@/core/repositories/pagination-params'
import { Optional } from '@/core/types/optional'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchQuestionAnswersUseCaseRequest extends PaginationParams {
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
  }: Optional<
    FetchQuestionAnswersUseCaseRequest,
    'page' | 'perPage'
  >): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page, perPage },
    )

    if (!answers.length) {
      return left(new ResourceNotFoundError())
    }

    return right({
      answers,
    })
  }
}
