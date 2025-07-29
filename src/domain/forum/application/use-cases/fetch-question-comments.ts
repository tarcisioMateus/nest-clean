import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
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

interface FetchQuestionCommentsUseCaseRequest extends LoadingParams {
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    loading = DEFAULT_LOADING,
    perLoading = DEFAULT_PER_LOADING,
  }: Optional<
    FetchQuestionCommentsUseCaseRequest,
    'loading' | 'perLoading'
  >): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          loading,
          perLoading,
        },
      )

    if (!comments.length) {
      return left(new ResourceNotFoundError())
    }

    return right({
      comments,
    })
  }
}
