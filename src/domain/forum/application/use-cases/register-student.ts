import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, right, left } from '@/core/either'
import { UnavailableCredentialsError } from './errors/unavailable-credentials-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  UnavailableCredentialsError,
  {
    student: Student
  }
>

export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const userWithEmail = await this.studentsRepository.findByEmail(email)

    if (userWithEmail) {
      return left(new UnavailableCredentialsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
