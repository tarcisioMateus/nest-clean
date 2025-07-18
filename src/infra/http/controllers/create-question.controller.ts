import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { UnavailableCredentialsError } from '@/domain/forum/application/use-cases/errors/unavailable-credentials-error'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsId: z.array(z.uuid()).optional().default([]),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const zodValidationPipe = new ZodValidationPipe<CreateQuestionBodySchema>(
  createQuestionBodySchema,
)

@Controller('/question')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async execute(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content, attachmentsId } = body
    const userId = user.sub

    const response = await this.createQuestion.execute({
      authorId: userId,
      content,
      title,
      attachmentsId,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case UnavailableCredentialsError:
          throw new ConflictException(response.value.message)

        default:
          throw new BadRequestException(response.value.message)
      }
    }
  }
}
