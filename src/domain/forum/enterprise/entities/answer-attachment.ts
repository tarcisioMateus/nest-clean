import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    if (id && !id.equals(props.attachmentId)) {
      throw new Error(`
        The attachmentId and id should have the same value to prevent confusion, 
        on the persistence side of the application
        `)
    }
    const attachment = new AnswerAttachment(props, props.attachmentId)

    return attachment
  }
}
