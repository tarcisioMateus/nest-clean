import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(
  props: QuestionAttachmentProps,
): QuestionAttachment {
  const questionAttachment = QuestionAttachment.create(
    {
      ...props,
    },
    props.attachmentId,
  )

  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    props: QuestionAttachmentProps,
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(props)

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
