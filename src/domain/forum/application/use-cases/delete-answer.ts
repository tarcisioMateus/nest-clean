import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const attachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    answer.attachments = new AnswerAttachmentList(attachments)
    answer.attachments.update([])

    const removedAttachmentsIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })
    const removedAttachments = await this.attachmentsRepository.findManyByIds(
      removedAttachmentsIds,
    )
    answer.addDomainEventForRemovedAttachments(removedAttachments)

    await this.answersRepository.delete(answer)

    return right(null)
  }
}
