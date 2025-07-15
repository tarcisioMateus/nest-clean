import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  props: AnswerAttachmentProps,
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      ...props,
    },
    id,
  )

  return answerAttachment
}
