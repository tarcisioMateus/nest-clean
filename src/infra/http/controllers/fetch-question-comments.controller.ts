import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
} from '@nestjs/common'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { CommentPresenter } from '../presenter/comment-presenter'

@Controller('/question/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('questionId', zodIdParamValidationPipe) questionId: IdParamSchema,
  ) {
    const response = await this.fetchQuestionComments.execute({ questionId })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const comments = response.value.questionComments.map(
      CommentPresenter.toHttp,
    )

    return { comments }
  }
}
