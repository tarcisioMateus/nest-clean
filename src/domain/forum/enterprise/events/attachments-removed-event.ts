import { DomainEvent } from '@/core/events/domain-event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../entities/question'
import { Answer } from '../entities/answer'
import { Attachment } from '../entities/attachment'

export class AttachmentsRemovedEvent implements DomainEvent {
  public ocurredAt: Date
  public aggregateId: UniqueEntityID
  public removedAttachments: Attachment[]

  constructor(aggregate: Question | Answer, attachments: Attachment[]) {
    this.ocurredAt = new Date()
    this.aggregateId = aggregate.id
    this.removedAttachments = attachments
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregateId
  }
}
