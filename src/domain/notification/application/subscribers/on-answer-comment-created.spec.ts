import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnAnswerCommentCreated } from './on-answer-comment-created'
import { MockInstance } from 'vitest'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: OnAnswerCommentCreated // eslint-disable-line
let onSendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    onSendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    sut = new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment({ answerId: answer.id })

    await inMemoryAnswersRepository.create(answer)
    await inMemoryAnswerCommentsRepository.create(comment)

    await vi.waitFor(() => {
      expect(onSendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
