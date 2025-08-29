import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionCommentsRepository } from './in-memory-question-comments-repository'
import { InMemoryAnswersRepository } from './in-memory-answers-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private readonly attachmentsRepository: InMemoryAttachmentsRepository,
    private readonly questionCommentsRepository: InMemoryQuestionCommentsRepository,
    private readonly answersRepository: InMemoryAnswersRepository,
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  public items: Question[] = []

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: Slug) {
    const question = this.items.find((item) => item.slug.value === slug.value)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: Slug): Promise<QuestionWithDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug.value)

    if (!question) {
      return null
    }

    const attachments = (
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.toString(),
      )
    ).map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `No existent attachment: "${questionAttachment.attachmentId.toString()}"`,
        )
      }

      return {
        id: attachment.id,
        url: attachment.url,
        title: attachment.title,
      }
    })

    const commentsLength = this.questionCommentsRepository.items.filter(
      (comment) => {
        return comment.questionId.equals(question.id)
      },
    ).length

    const student = await this.studentsRepository.findById(
      question.authorId.toString(),
    )

    if (!student) {
      throw new Error(`author not founded: "${question.authorId.toString()}"`)
    }

    const answersLength = this.answersRepository.items.filter((answer) => {
      return answer.questionId.equals(question.id)
    }).length

    return QuestionWithDetails.create({
      question: {
        id: question.id,
        content: question.content,
        createdAt: question.createdAt,
        slug: question.slug,
        title: question.title,
        bestAnswerID: question.bestAnswerId,
        updatedAt: question.updatedAt,
      },
      answers: { length: answersLength, loaded: 0 },
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

  async fetchManyRecent({
    page,
    perPage,
  }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort(
        (a: Question, b: Question) =>
          b.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice((page - 1) * perPage, page * perPage)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)
    this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    )

    this.items[questionIndex] = question
    this.questionAttachmentsRepository.save(question.attachments)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    )

    this.items.splice(questionIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
