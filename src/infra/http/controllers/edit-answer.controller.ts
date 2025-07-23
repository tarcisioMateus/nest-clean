import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsId: z.array(z.uuid()).optional().default([]),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const zodBodyValidationPipe = new ZodValidationPipe<EditAnswerBodySchema>(
  editAnswerBodySchema,
)

@Controller('/answer/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('id', zodIdParamValidationPipe) answerId: IdParamSchema,
    @Body(zodBodyValidationPipe) body: EditAnswerBodySchema,
  ) {
    const { content, attachmentsId } = body
    const userId = user.sub

    const response = await this.editAnswer.execute({
      authorId: userId,
      content,
      attachmentsId,
      answerId,
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
