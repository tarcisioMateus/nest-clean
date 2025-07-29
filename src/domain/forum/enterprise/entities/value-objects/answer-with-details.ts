import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface AnswerWithDetailsProps {
  answer: {
    id: UniqueEntityID
    content: string
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
}

export class AnswerWithDetails extends ValueObject<AnswerWithDetailsProps> {
  get answerId() {
    return this.props.answer.id
  }

  get answerContent() {
    return this.props.answer.content
  }

  get answerCreatedAt() {
    return this.props.answer.createdAt
  }

  get answerUpdatedAt() {
    return this.props.answer.updatedAt
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

  static create(props: AnswerWithDetailsProps) {
    const answer = new AnswerWithDetails(props)

    return answer
  }
}
