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
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const zodValidationPipe = new ZodValidationPipe<CommentOnQuestionBodySchema>(
  commentOnQuestionBodySchema,
)

@Controller('/question/:questionId/comment')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('questionId', zodIdParamValidationPipe) questionId: IdParamSchema,
    @Body(zodValidationPipe) body: CommentOnQuestionBodySchema,
  ) {
    const { content } = body
    const userId = user.sub

    const response = await this.commentOnQuestion.execute({
      authorId: userId,
      content,
      questionId,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }
  }
}
