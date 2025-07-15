import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryHasher } from 'test/cryptography/in-memory-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryHasher: InMemoryHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryHasher = new InMemoryHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, inMemoryHasher)
  })

  it('should be able to register an student, with hashed password', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      email: 'johnDoe@email.com',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      student: expect.objectContaining({ name: 'John Doe' }),
    })

    const hashedPassword = await inMemoryHasher.hash('123456')
    expect(response.value).toEqual({
      student: expect.objectContaining({ password: hashedPassword }),
    })
  })
})
