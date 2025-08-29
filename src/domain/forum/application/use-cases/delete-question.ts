import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const attachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    question.attachments = new QuestionAttachmentList(attachments)
    question.attachments.update([])

    const removedAttachmentsIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })
    const removedAttachments = await this.attachmentsRepository.findManyByIds(
      removedAttachmentsIds,
    )
    question.addDomainEventForRemovedAttachments(removedAttachments)

    await this.questionsRepository.delete(question)

    return right(null)
  }
}
