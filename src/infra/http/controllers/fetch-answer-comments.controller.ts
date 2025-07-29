import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { CommentWithAuthorPresenter } from '../presenter/comment-with-author-presenter'
import {
  LoadingQuerySchema,
  zodLoadingQueryValidationPipe,
} from './input-schema/loading-query-schema'
import {
  PerLoadingQuerySchema,
  zodPerLoadingQueryValidationPipe,
} from './input-schema/per-loading-query-schema'

@Controller('/answer/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('answerId', zodIdParamValidationPipe) answerId: IdParamSchema,
    @Query('loading', zodLoadingQueryValidationPipe)
    loading: LoadingQuerySchema,
    @Query('perLoading', zodPerLoadingQueryValidationPipe)
    perLoading: PerLoadingQuerySchema,
  ) {
    const response = await this.fetchAnswerComments.execute({
      answerId,
      loading,
      perLoading,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const comments = response.value.comments.map(
      CommentWithAuthorPresenter.toHttp,
    )

    return { comments }
  }
}
