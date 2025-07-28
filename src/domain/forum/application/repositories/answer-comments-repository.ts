import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<CommentWithAuthor[]>

  abstract create(AnswerComment: AnswerComment): Promise<void>
  abstract delete(AnswerComment: AnswerComment): Promise<void>
}
