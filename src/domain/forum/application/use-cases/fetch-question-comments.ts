import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import {
  PaginationParams,
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '@/core/repositories/pagination-params'
import { Optional } from '@/core/types/optional'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentsUseCaseRequest extends PaginationParams {
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComments: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
  }: Optional<
    FetchQuestionCommentsUseCaseRequest,
    'page' | 'perPage'
  >): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        perPage,
      })

    if (!questionComments.length) {
      return left(new ResourceNotFoundError())
    }

    return right({
      questionComments,
    })
  }
}
