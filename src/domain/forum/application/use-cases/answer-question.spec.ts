import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })
  it('should be able to create an answer', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

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
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id.toString(),
      authorId: '1',
      content: 'New answer',
      attachmentsId: ['1', '2'],
    })

    expect(response.isRight()).toBeTruthy()

    if (response.isRight()) {
      expect(response.value.answer.attachments.getItems()).toHaveLength(2)
      expect(inMemoryAnswerAttachmentsRepository.items[0]).toEqual(
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      )
    }
  })

  it('should NOT create an answer without being linked to a valid question', async () => {
    const response = await sut.execute({
      questionId: 'invalid-question-id',
      authorId: '1',
      content: 'New answer',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
