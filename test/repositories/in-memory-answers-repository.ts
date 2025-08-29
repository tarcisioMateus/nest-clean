import { DomainEvents } from '@/core/events/domain-events'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerWithDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-with-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryAnswerCommentsRepository } from './in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'
import { LoadingParams } from '@/core/repositories/loading-params'

export class InMemoryAnswersRepository implements AnswersRepository {
  constructor(
    private readonly answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
    private readonly attachmentsRepository: InMemoryAttachmentsRepository,
    private readonly answerCommentsRepository: InMemoryAnswerCommentsRepository,
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((loading - 1) * perLoading, loading * perLoading)

    return answers
  }

  async findManyByQuestionIdWithDetails(
    questionId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<AnswerWithDetails[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((loading - 1) * perLoading, loading * perLoading)

    const getAnswerWithDetails = (answer: Answer) => {
      const attachments = this.answerAttachmentsRepository.items
        .filter((answerAttachment) => {
          return answerAttachment.answerId.equals(answer.id)
        })
        .map((answerAttachment) => {
          const attachment = this.attachmentsRepository.items.find(
            (attachment) => {
              return attachment.id.equals(answerAttachment.attachmentId)
            },
          )

          if (!attachment) {
            throw new Error(
              `No existent attachment: "${answerAttachment.attachmentId.toString()}"`,
            )
          }

          return {
            id: attachment.id,
            url: attachment.url,
            title: attachment.title,
          }
        })

      const commentsLength = this.answerCommentsRepository.items.filter(
        (comment) => {
          return comment.answerId.equals(answer.id)
        },
      ).length

      const student = this.studentsRepository.items.find((student) => {
        return student.id.equals(answer.authorId)
      })

      if (!student) {
        throw new Error(`author not founded: "${answer.authorId.toString()}"`)
      }

      return AnswerWithDetails.create({
        answer: {
          content: answer.content,
          createdAt: answer.createdAt,
          id: answer.id,
          updatedAt: answer.updatedAt,
        },
        attachments,
        comments: {
          length: commentsLength,
        },
        author: {
          id: student.id,
          name: student.name,
        },
      })
    }

    return answers.map(getAnswerWithDetails)
  }

  async create(answer: Answer) {
    this.items.push(answer)
    this.answerAttachmentsRepository.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    )

    this.items[answerIndex] = answer
    this.answerAttachmentsRepository.save(answer.attachments)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    )

    this.items.splice(answerIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
