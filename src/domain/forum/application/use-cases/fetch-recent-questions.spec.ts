import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch sorted questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(2025, 6, i) }),
      )
    }

    const response = await sut.execute({ page: 1 })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.questions[0]).toEqual(
        expect.objectContaining({ createdAt: new Date(2025, 6, 22) }),
      )
      expect(response.value.questions[1]).toEqual(
        expect.objectContaining({ createdAt: new Date(2025, 6, 21) }),
      )
      expect(response.value.questions[2]).toEqual(
        expect.objectContaining({ createdAt: new Date(2025, 6, 20) }),
      )
    }
  })

  it('should be able to fetch paginated questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(
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
