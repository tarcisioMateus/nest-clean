import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await inMemoryStudentsRepository.create(student)

    const comment01 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment02 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    await inMemoryQuestionCommentsRepository.create(comment01)
    await inMemoryQuestionCommentsRepository.create(comment02)

    const response = await sut.execute({ questionId: 'question-1' })

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
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const response = await sut.execute({
      questionId: 'question-1',
      loading: 8,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.comments).toHaveLength(1)
    }
  })
})
