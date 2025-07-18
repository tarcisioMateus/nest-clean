import { StudentsRepository } from '../repositories/students-repository'
import { Either, right, left } from '@/core/either'
import { CredentialsError } from './errors/credentials-error'
import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'

interface CreateSessionUseCaseRequest {
  email: string
  password: string
}

type CreateSessionUseCaseResponse = Either<
  CredentialsError,
  {
    token: string
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
    const user = await this.studentsRepository.findByEmail(email)

    if (!user) {
      return left(new CredentialsError())
    }

    const passwordMatch = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!passwordMatch) {
      return left(new CredentialsError())
    }

    const token = await this.encrypter.encrypt({ sub: user.id.toValue() })

    return right({ token })
  }
}
