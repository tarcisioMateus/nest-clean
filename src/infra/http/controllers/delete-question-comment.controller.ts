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
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller('/question/comment/:id')
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionComment: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('id', zodIdParamValidationPipe) commentId: IdParamSchema,
  ) {
    const userId = user.sub

    const response = await this.deleteQuestionComment.execute({
      authorId: userId,
      commentId,
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
