import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import {
  PaginationParams,
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '@/core/repositories/pagination-params'
import { Optional } from '@/core/types/optional'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface FetchAnswerCommentsUseCaseRequest extends PaginationParams {
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
  }: Optional<
    FetchAnswerCommentsUseCaseRequest,
    'page' | 'perPage'
  >): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        perPage,
      })

    if (!answerComments.length) {
      return left(new ResourceNotFoundError())
    }

    return right({
      answerComments,
    })
  }
}
