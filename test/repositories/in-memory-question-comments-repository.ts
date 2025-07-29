import { DomainEvents } from '@/core/events/domain-events'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { LoadingParams } from '@/core/repositories/loading-params'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private readonly studentRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((loading - 1) * perLoading, loading * perLoading)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)

    DomainEvents.dispatchEventsForAggregate(questionComment.id)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id.toValue() === questionComment.id.toValue(),
    )

    this.items.splice(questionCommentIndex, 1)
  }
}
