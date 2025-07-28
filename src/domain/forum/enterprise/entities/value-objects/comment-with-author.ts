import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface CommentWithAuthorProps {
  comment: {
    id: UniqueEntityID
    content: string
    createdAt: Date
    updatedAt?: Date | null
  }
  author: {
    id: UniqueEntityID
    name: string
  }
}
export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId() {
    return this.props.comment.id
  }

  get commentContent() {
    return this.props.comment.content
  }

  get commentCreatedAt() {
    return this.props.comment.createdAt
  }

  get commentUpdatedAt() {
    return this.props.comment.updatedAt
  }

  get authorId() {
    return this.props.author.id
  }

  get authorName() {
    return this.props.author.name
  }

  static create(props: CommentWithAuthorProps) {
    const commentWithAuthor = new CommentWithAuthor(props)

    return commentWithAuthor
  }
}
