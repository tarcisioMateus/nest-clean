import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const zodValidationPipe = new ZodValidationPipe<CommentOnAnswerBodySchema>(
  commentOnAnswerBodySchema,
)

@Controller('/answer/:answerId/comment')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('answerId', zodIdParamValidationPipe) answerId: IdParamSchema,
    @Body(zodValidationPipe) body: CommentOnAnswerBodySchema,
  ) {
    const { content } = body
    const userId = user.sub

    const response = await this.commentOnAnswer.execute({
      authorId: userId,
      content,
      answerId,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }
  }
}
