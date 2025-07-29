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
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: OnAnswerCommentCreated // eslint-disable-line
let onSendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    const {
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository,
      inMemoryNotificationsRepository,
    } = GetAllInMemoryRepositories.execute()

    answerCommentsRepository = inMemoryAnswerCommentsRepository
    answersRepository = inMemoryAnswersRepository
    notificationsRepository = inMemoryNotificationsRepository

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    onSendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    sut = new OnAnswerCommentCreated(answersRepository, sendNotificationUseCase)
  })

  it('should be able to send a notification', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment({ answerId: answer.id })

    await answersRepository.create(answer)
    await answerCommentsRepository.create(comment)

    await vi.waitFor(() => {
      expect(onSendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
