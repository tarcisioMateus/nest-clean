import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<QuestionComment[]>
  create(QuestionComment: QuestionComment): Promise<void>
  delete(QuestionComment: QuestionComment): Promise<void>
}
