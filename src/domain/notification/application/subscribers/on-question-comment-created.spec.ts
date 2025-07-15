import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionCommentCreated } from './on-question-comment-created'
import { MockInstance } from 'vitest'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: OnQuestionCommentCreated // eslint-disable-line
let onSendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    onSendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    sut = new OnQuestionCommentCreated(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification', async () => {
    const question = makeQuestion()
    const comment = makeQuestionComment({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionCommentsRepository.create(comment)

    await vi.waitFor(() => {
      expect(onSendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
