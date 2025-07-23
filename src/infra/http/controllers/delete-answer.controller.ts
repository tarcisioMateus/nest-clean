import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

@Controller('/answer/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('id', zodIdParamValidationPipe) answerId: IdParamSchema,
  ) {
    const userId = user.sub

    const response = await this.deleteAnswer.execute({
      authorId: userId,
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
