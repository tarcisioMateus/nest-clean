import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { LoadingParams } from '@/core/repositories/loading-params'

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<CommentWithAuthor[]>

  abstract create(QuestionComment: QuestionComment): Promise<void>
  abstract delete(QuestionComment: QuestionComment): Promise<void>
}
