import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { LoadingParams } from '@/core/repositories/loading-params'

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<CommentWithAuthor[]>

  abstract create(AnswerComment: AnswerComment): Promise<void>
  abstract delete(AnswerComment: AnswerComment): Promise<void>
}
