import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const response = await sut.execute({ questionId: 'question-1' })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.questionComments).toHaveLength(20)
    }
  })

  it('should be able to fetch paginated comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const response = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.questionComments).toHaveLength(2)
    }
  })
})
