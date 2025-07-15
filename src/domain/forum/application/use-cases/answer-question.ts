import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Optional } from '@/core/types/optional'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
  attachmentsId: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsId = [],
  }: Optional<
    AnswerQuestionUseCaseRequest,
    'attachmentsId'
  >): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments: AnswerAttachment[] = attachmentsId.map(
      (attachmentId) =>
        AnswerAttachment.create({
          answerId: answer.id,
          attachmentId: new UniqueEntityID(attachmentId),
        }),
    )

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
