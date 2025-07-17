import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { UnavailableCredentialsError } from './errors/unavailable-credentials-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create an question', async () => {
    const response = await sut.execute({
      title: 'question 1',
      authorId: '1',
      content: 'New question',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({ content: 'New question' }),
      }),
    )
  })

  it('should be able to create an question with attachments', async () => {
    const response = await sut.execute({
      title: 'question 1',
      authorId: '1',
      content: 'New question',
      attachmentsId: ['1', '2'],
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.question.attachments.getItems()).toHaveLength(2)
      expect(inMemoryQuestionAttachmentsRepository.items[0]).toEqual(
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      )
    }
  })

  it('should NOT be able to create 2 questions with same title/slug', async () => {
    const question = makeQuestion({ title: 'question 1' })

    await inMemoryQuestionsRepository.create(question)

    const response = await sut.execute({
      title: question.title,
      authorId: '1',
      content: 'New question',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnavailableCredentialsError)
  })
})
