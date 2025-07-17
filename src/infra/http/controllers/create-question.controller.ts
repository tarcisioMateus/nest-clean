import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

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
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async execute(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content, attachmentsId } = body
    const userId = user.sub

    const response = await this.createQuestionUseCase.execute({
      authorId: userId,
      content,
      title,
      attachmentsId,
    })

    if (response.isLeft()) {
      throw new ConflictException(response.value.message)
    }
  }
}
