import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Optional } from '@/core/types/optional'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import {
  LoadingParams,
  DEFAULT_LOADING,
  DEFAULT_PER_LOADING,
} from '@/core/repositories/loading-params'

interface FetchAnswerCommentsUseCaseRequest extends LoadingParams {
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    loading = DEFAULT_LOADING,
    perLoading = DEFAULT_PER_LOADING,
  }: Optional<
    FetchAnswerCommentsUseCaseRequest,
    'loading' | 'perLoading'
  >): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          loading,
          perLoading,
        },
      )

    if (!comments.length) {
      return left(new ResourceNotFoundError())
    }

    return right({ comments })
  }
}
