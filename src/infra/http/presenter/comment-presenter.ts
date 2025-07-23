import { Comment } from '@/domain/forum/enterprise/entities/comment'
import { AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment'
import { QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment'

export class CommentPresenter {
  static toHttp(comment: Comment<QuestionCommentProps | AnswerCommentProps>) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
    }
  }
}
