import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryHasher } from 'test/cryptography/in-memory-hasher'
import { CreateSessionUseCase } from './create-session'
import { InMemoryEncrypter } from 'test/cryptography/in-memory-encrypter'
import { makeStudent } from 'test/factories/make-student'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let studentsRepository: InMemoryStudentsRepository
let inMemoryHasher: InMemoryHasher
let inMemoryEncrypter: InMemoryEncrypter
let sut: CreateSessionUseCase

describe('Create Session', () => {
  beforeEach(() => {
    const { inMemoryStudentsRepository } = GetAllInMemoryRepositories.execute()
    studentsRepository = inMemoryStudentsRepository

    inMemoryHasher = new InMemoryHasher()
    inMemoryEncrypter = new InMemoryEncrypter()

    sut = new CreateSessionUseCase(
      studentsRepository,
      inMemoryHasher,
      inMemoryEncrypter,
    )
  })

  it('should be able to create a session', async () => {
    const student = makeStudent({
      password: await inMemoryHasher.hash('123456'),
    })

    await studentsRepository.create(student)

    const response = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      token: expect.any(String),
      studentDetails: {
        props: expect.objectContaining({
          student: expect.objectContaining({ email: student.email }),
          notifications: { pendent: 0 },
        }),
      },
    })
  })
})
