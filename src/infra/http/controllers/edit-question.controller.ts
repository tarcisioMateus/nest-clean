import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsId: z.array(z.uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const zodBodyValidationPipe = new ZodValidationPipe<EditQuestionBodySchema>(
  editQuestionBodySchema,
)

@Controller('/question/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('id', zodIdParamValidationPipe) questionId: IdParamSchema,
    @Body(zodBodyValidationPipe) body: EditQuestionBodySchema,
  ) {
    const { title, content, attachmentsId } = body
    const userId = user.sub

    const response = await this.editQuestion.execute({
      authorId: userId,
      content,
      title,
      attachmentsId,
      questionId,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(response.value.message)

        default:
          throw new BadRequestException(response.value.message)
      }
    }
  }
}
