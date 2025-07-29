import { Slug } from './slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface QuestionWithDetailsProps {
  question: {
    id: UniqueEntityID
    title: string
    slug: Slug
    content: string
    bestAnswerID?: UniqueEntityID | null
    createdAt: Date
    updatedAt?: Date | null
  }
  attachments: {
    title: string
    url: string
    id: UniqueEntityID
  }[]
  author: {
    id: UniqueEntityID
    name: string
  }
  comments: {
    length: number
  }
  answers: {
    length: number
    loaded: number
  }
}

export class QuestionWithDetails extends ValueObject<QuestionWithDetailsProps> {
  get questionId() {
    return this.props.question.id
  }

  get questionTitle() {
    return this.props.question.title
  }

  get questionSlug() {
    return this.props.question.slug
  }

  get questionContent() {
    return this.props.question.content
  }

  get questionBestAnswerID() {
    return this.props.question.bestAnswerID
  }

  get questionCreatedAt() {
    return this.props.question.createdAt
  }

  get questionUpdatedAt() {
    return this.props.question.updatedAt
  }

  get attachments() {
    return this.props.attachments
  }

  get authorId() {
    return this.props.author.id
  }

  get authorName() {
    return this.props.author.name
  }

  get commentsLength() {
    return this.props.comments.length
  }

  get answers() {
    return this.props.answers
  }

  static create(props: QuestionWithDetailsProps) {
    const question = new QuestionWithDetails(props)

    return question
  }
}
