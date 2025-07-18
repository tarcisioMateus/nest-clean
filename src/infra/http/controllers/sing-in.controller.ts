import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateSessionUseCase } from '@/domain/forum/application/use-cases/create-session'
import { CredentialsError } from '@/domain/forum/application/use-cases/errors/credentials-error'
import { Public } from '@/infra/auth/public'

const singInBodySchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8).max(32),
})

type SingInBodySchema = z.infer<typeof singInBodySchema>

@Controller('/sing-in')
export class SingInController {
  constructor(private readonly createSession: CreateSessionUseCase) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe<SingInBodySchema>(singInBodySchema))
  async execute(@Body() body: SingInBodySchema) {
    const { email, password } = body

    const response = await this.createSession.execute({ email, password })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case CredentialsError:
          throw new UnauthorizedException(response.value.message)
        default:
          throw new BadRequestException(response.value.message)
      }
    }

    const { token } = response.value

    return { token }
  }
}
