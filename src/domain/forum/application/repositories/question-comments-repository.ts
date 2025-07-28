import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<CommentWithAuthor[]>

  abstract create(QuestionComment: QuestionComment): Promise<void>
  abstract delete(QuestionComment: QuestionComment): Promise<void>
}
