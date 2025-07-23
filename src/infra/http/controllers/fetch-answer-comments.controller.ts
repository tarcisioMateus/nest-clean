import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
} from '@nestjs/common'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { CommentPresenter } from '../presenter/comment-presenter'

@Controller('/answer/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('answerId', zodIdParamValidationPipe) answerId: IdParamSchema,
  ) {
    const response = await this.fetchAnswerComments.execute({ answerId })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const comments = response.value.answerComments.map(CommentPresenter.toHttp)

    return { comments }
  }
}
