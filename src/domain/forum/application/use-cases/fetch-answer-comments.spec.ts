import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const response = await sut.execute({ answerId: 'answer-1' })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.answerComments).toHaveLength(20)
    }
  })

  it('should be able to fetch paginated comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.answerComments).toHaveLength(2)
    }
  })
})
