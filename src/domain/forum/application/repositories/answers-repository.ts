import { Answer } from '../../enterprise/entities/answer'
import { AnswerWithDetails } from '../../enterprise/entities/value-objects/answer-with-details'
import { LoadingParams } from '@/core/repositories/loading-params'

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Answer[]>

  abstract findManyByQuestionIdWithDetails(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<AnswerWithDetails[]>

  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
