import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  props: QuestionAttachmentProps,
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      ...props,
    },
    id,
  )

  return questionAttachment
}
