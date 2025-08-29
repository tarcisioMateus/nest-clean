import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'
import { AttachmentsRemovedEvent } from '../events/attachments-removed-event'
import { Attachment } from './attachment'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerID?: UniqueEntityID | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerID
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew() {
    return dayjs().diff(this.createdAt, 'days') < 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set bestAnswerId(bestAnswerID: UniqueEntityID | undefined | null) {
    if (bestAnswerID) {
      if (
        !this.props.bestAnswerID ||
        !bestAnswerID.equals(this.props.bestAnswerID)
      ) {
        this.addDomainEvent(
          new QuestionBestAnswerChosenEvent(this, bestAnswerID),
        )
      }
    }
    this.props.bestAnswerID = bestAnswerID
    this.touch()
  }

  public addDomainEventForRemovedAttachments(removedAttachments: Attachment[]) {
    if (removedAttachments.length > 0) {
      this.addDomainEvent(new AttachmentsRemovedEvent(this, removedAttachments))
    }
  }

  static create(
    props: Optional<
      QuestionProps,
      'createdAt' | 'updatedAt' | 'slug' | 'attachments' | 'bestAnswerID'
    >,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
        bestAnswerID: undefined,
      },
      id,
    )

    return question
  }
}
