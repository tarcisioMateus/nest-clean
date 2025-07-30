import { StudentsRepository } from '../repositories/students-repository'
import { Either, right, left } from '@/core/either'
import { CredentialsError } from './errors/credentials-error'
import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { StudentWithDetails } from '../../enterprise/entities/value-objects/student-with-details'

interface CreateSessionUseCaseRequest {
  email: string
  password: string
}

type CreateSessionUseCaseResponse = Either<
  CredentialsError,
  {
    token: string
    studentDetails: StudentWithDetails
  }
>

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
    const user = await this.studentsRepository.findDetailsByEmail(email)

    if (!user) {
      return left(new CredentialsError())
    }

    const passwordMatch = await this.hashCompare.compare(
      password,
      user.studentPassword,
    )

    if (!passwordMatch) {
      return left(new CredentialsError())
    }

    const token = await this.encrypter.encrypt({
      sub: user.studentId.toValue(),
    })

    return right({ token, studentDetails: user })
  }
}
