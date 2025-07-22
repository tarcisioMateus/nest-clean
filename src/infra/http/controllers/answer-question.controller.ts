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
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsId: z.array(z.uuid()).optional().default([]),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const zodValidationPipe = new ZodValidationPipe<AnswerQuestionBodySchema>(
  answerQuestionBodySchema,
)

@Controller('/answer/:questionId')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async execute(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId', zodIdParamValidationPipe) questionId: IdParamSchema,
  ) {
    const { content, attachmentsId } = body
    const userId = user.sub

    const response = await this.answerQuestion.execute({
      authorId: userId,
      content,
      attachmentsId,
      questionId,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}
