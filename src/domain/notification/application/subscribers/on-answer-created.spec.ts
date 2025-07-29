import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'
import { MockInstance } from 'vitest'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: OnAnswerCreated // eslint-disable-line
let onSendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    const {
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
      inMemoryNotificationsRepository,
    } = GetAllInMemoryRepositories.execute()

    notificationsRepository = inMemoryNotificationsRepository
    questionsRepository = inMemoryQuestionsRepository
    answersRepository = inMemoryAnswersRepository

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    onSendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    sut = new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should be able to send a notification', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await vi.waitFor(() => {
      expect(onSendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
