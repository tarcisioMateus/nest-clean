import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

export class GetAllInMemoryRepositories {
  static execute() {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository(
      inMemoryNotificationsRepository,
    )
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryAnswerCommentsRepository,
      inMemoryStudentsRepository,
    )
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryQuestionCommentsRepository,
      inMemoryAnswersRepository,
      inMemoryStudentsRepository,
    )

    return {
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryAnswerAttachmentsRepository,
      inMemoryQuestionCommentsRepository,
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
      inMemoryNotificationsRepository,
    }
  }
}
