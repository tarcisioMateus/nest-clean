import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsId: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    answer.attachments = new AnswerAttachmentList(currentAttachments)

    const updatedAttachments = attachmentsId.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      }),
    )

    answer.attachments.update(updatedAttachments)
    answer.content = content

    await this.answersRepository.save(answer)

    return right(null)
  }
}
