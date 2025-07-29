import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    const { inMemoryQuestionsRepository } = GetAllInMemoryRepositories.execute()

    questionsRepository = inMemoryQuestionsRepository

    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch sorted questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(
        makeQuestion({ createdAt: new Date(2025, 6, i) }),
      )
    }

    const response = await sut.execute({ page: 1 })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ createdAt: new Date(2025, 6, 22) }),
          expect.objectContaining({ createdAt: new Date(2025, 6, 21) }),
          expect.objectContaining({ createdAt: new Date(2025, 6, 20) }),
        ]),
      )
    }
  })

  it('should be able to fetch paginated questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(
        makeQuestion({ createdAt: new Date(2025, 6, i) }),
      )
    }

    const response = await sut.execute({ page: 2 })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.questions).toHaveLength(2)
      expect(response.value.questions[0]).toEqual(
        expect.objectContaining({ createdAt: new Date(2025, 6, 2) }),
      )
      expect(response.value.questions[1]).toEqual(
        expect.objectContaining({ createdAt: new Date(2025, 6, 1) }),
      )
    }
  })
})
