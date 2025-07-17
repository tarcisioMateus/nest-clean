import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { Optional } from '@/core/types/optional'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'
import { UnavailableCredentialsError } from './errors/unavailable-credentials-error'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsId: string[]
}

type CreateQuestionUseCaseResponse = Either<
  UnavailableCredentialsError,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsId = [],
  }: Optional<
    CreateQuestionUseCaseRequest,
    'attachmentsId'
  >): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      content,
      authorId: new UniqueEntityID(authorId),
      title,
    })

    const questionWithSlug = await this.questionsRepository.findBySlug(
      question.slug,
    )

    if (questionWithSlug) {
      return left(
        new UnavailableCredentialsError("'please change your question title!'"),
      )
    }

    const questionAttachments: QuestionAttachment[] = attachmentsId.map(
      (attachmentId) =>
        QuestionAttachment.create({
          questionId: question.id,
          attachmentId: new UniqueEntityID(attachmentId),
        }),
    )

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
