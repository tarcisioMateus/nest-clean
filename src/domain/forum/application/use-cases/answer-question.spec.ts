import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it('should be able to create an answer', async () => {
    const response = await sut.execute({
      questionId: '1',
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
    const response = await sut.execute({
      questionId: '1',
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
})
