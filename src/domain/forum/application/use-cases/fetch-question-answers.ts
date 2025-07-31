import { AnswersRepository } from '../repositories/answers-repository'
import { Optional } from '@/core/types/optional'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AnswerWithDetails } from '../../enterprise/entities/value-objects/answer-with-details'
import {
  LoadingParams,
  DEFAULT_LOADING,
  DEFAULT_PER_LOADING,
} from '@/core/repositories/loading-params'

interface FetchQuestionAnswersUseCaseRequest extends LoadingParams {
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: AnswerWithDetails[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    loading,
    perLoading,
  }: Optional<
    FetchQuestionAnswersUseCaseRequest,
    'loading' | 'perLoading'
  >): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers =
      await this.answersRepository.findManyByQuestionIdWithDetails(questionId, {
        loading: loading ?? DEFAULT_LOADING,
        perLoading: perLoading ?? DEFAULT_PER_LOADING,
      })

    if (!answers.length) {
      return left(new ResourceNotFoundError())
    }

    return right({
      answers,
    })
  }
}
