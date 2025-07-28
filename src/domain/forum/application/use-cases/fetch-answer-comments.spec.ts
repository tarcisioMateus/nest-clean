import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await inMemoryStudentsRepository.create(student)

    const comment01 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment02 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    await inMemoryAnswerCommentsRepository.create(comment01)
    await inMemoryAnswerCommentsRepository.create(comment02)

    const response = await sut.execute({ answerId: 'answer-1' })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.comments).toHaveLength(2)
      expect(response.value.comments).toEqual(
        expect.arrayContaining([
          {
            props: expect.objectContaining({
              comment: expect.objectContaining({ id: comment01.id }),
              author: expect.objectContaining({ name: 'John Doe' }),
            }),
          },
          {
            props: expect.objectContaining({
              comment: expect.objectContaining({ id: comment02.id }),
              author: expect.objectContaining({ name: 'John Doe' }),
            }),
          },
        ]),
      )
    }
  })

  it('should be able to fetch paginated comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await inMemoryStudentsRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.comments).toHaveLength(2)
    }
  })
})
