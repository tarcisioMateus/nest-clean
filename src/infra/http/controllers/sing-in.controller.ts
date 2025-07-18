import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateSessionUseCase } from '@/domain/forum/application/use-cases/create-session'

const singInBodySchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8).max(32),
})

type SingInBodySchema = z.infer<typeof singInBodySchema>

@Controller('/sing-in')
export class SingInController {
  constructor(private readonly createSession: CreateSessionUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe<SingInBodySchema>(singInBodySchema))
  async execute(@Body() body: SingInBodySchema) {
    const { email, password } = body

    const response = await this.createSession.execute({ email, password })

    if (response.isLeft()) {
      throw new UnauthorizedException(response.value.message)
    }

    const { token } = response.value

    return { token }
  }
}
