import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let studentsRepository: InMemoryStudentsRepository

let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    const {
      inMemoryStudentsRepository,
      inMemoryAnswerAttachmentsRepository,
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    } = GetAllInMemoryRepositories.execute()

    studentsRepository = inMemoryStudentsRepository
    questionsRepository = inMemoryQuestionsRepository
    answerAttachmentsRepository = inMemoryAnswerAttachmentsRepository
    answersRepository = inMemoryAnswersRepository

    sut = new AnswerQuestionUseCase(answersRepository, questionsRepository)
  })
  it('should be able to create an answer', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id.toString(),
      authorId: '1',
      content: 'New answer',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        answer: expect.objectContaining({ content: 'New answer' }),
      }),
    )
  })

  it('should be able to create an answer with attachments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id.toString(),
      authorId: student.id.toString(),
      content: 'New answer',
      attachmentsId: ['1', '2'],
    })

    expect(response.isRight()).toBeTruthy()

    if (response.isRight()) {
      expect(response.value.answer.attachments.getItems()).toHaveLength(2)
      expect(answerAttachmentsRepository.items[0]).toEqual(
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      )
    }
  })

  it('should NOT create an answer without being linked to a valid question', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const response = await sut.execute({
      questionId: 'invalid-question-id',
      authorId: student.id.toString(),
      content: 'New answer',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
