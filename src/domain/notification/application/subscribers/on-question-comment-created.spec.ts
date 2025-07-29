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
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sut: OnQuestionCommentCreated // eslint-disable-line
let onSendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    const {
      inMemoryQuestionCommentsRepository,
      inMemoryQuestionsRepository,
      inMemoryNotificationsRepository,
    } = GetAllInMemoryRepositories.execute()

    questionCommentsRepository = inMemoryQuestionCommentsRepository
    questionsRepository = inMemoryQuestionsRepository
    notificationsRepository = inMemoryNotificationsRepository

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    onSendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    sut = new OnQuestionCommentCreated(
      questionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification', async () => {
    const question = makeQuestion()
    const comment = makeQuestionComment({ questionId: question.id })

    await questionsRepository.create(question)
    await questionCommentsRepository.create(comment)

    await vi.waitFor(() => {
      expect(onSendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
