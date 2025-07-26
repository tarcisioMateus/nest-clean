import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    if (id && !id.equals(props.attachmentId)) {
      throw new Error(`
        The attachmentId and id should have the same value to prevent confusion, 
        on the persistence side of the application
        `)
    }
    const attachment = new QuestionAttachment(props, props.attachmentId)

    return attachment
  }
}
