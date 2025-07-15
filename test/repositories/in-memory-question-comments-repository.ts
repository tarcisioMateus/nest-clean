import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .splice((page - 1) * perPage, page * perPage)

    return questionComments
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
