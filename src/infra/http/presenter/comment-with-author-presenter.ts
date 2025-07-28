import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHttp(data: CommentWithAuthor) {
    return {
      comment: {
        id: data.commentId.toString(),
        content: data.commentContent,
        createdAt: data.commentCreatedAt,
        updatedAt: data.commentUpdatedAt,
      },
      author: {
        id: data.authorId.toString(),
        name: data.authorName,
      },
    }
  }
}
