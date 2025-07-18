import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

const singUpBodySchema = z.object({
  name: z.string(),
  email: z.email().trim(),
  password: z.string().min(8).max(32),
})

type SingUpBodySchema = z.infer<typeof singUpBodySchema>

@Controller('/sing-up')
export class SingUpController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe<SingUpBodySchema>(singUpBodySchema))
  async execute(@Body() body: SingUpBodySchema) {
    const { name, email, password } = body

    const response = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (response.isLeft()) {
      throw new ConflictException(response.value.message)
    }
  }
}
