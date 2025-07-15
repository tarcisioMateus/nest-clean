import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<AnswerComment[]>
  create(AnswerComment: AnswerComment): Promise<void>
  delete(AnswerComment: AnswerComment): Promise<void>
}
