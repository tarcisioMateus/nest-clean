import { DomainEvents } from '@/core/events/domain-events'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { LoadingParams } from '@/core/repositories/loading-params'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private readonly studentRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((loading - 1) * perLoading, loading * perLoading)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((loading - 1) * perLoading, loading * perLoading)
      .map((comment) => {
        const author = this.studentRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(`invalid authorId: "${comment.authorId}" `)
        }

        return CommentWithAuthor.create({
          comment: {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          },
          author: {
            id: comment.authorId,
            name: author.name,
          },
        })
      })

    return comments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id.toValue() === answerComment.id.toValue(),
    )

    this.items.splice(answerCommentIndex, 1)
  }
}
