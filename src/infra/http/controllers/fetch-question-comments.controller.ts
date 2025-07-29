import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
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

@Controller('/question/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('questionId', zodIdParamValidationPipe) questionId: IdParamSchema,
    @Query('loading', zodLoadingQueryValidationPipe)
    loading: LoadingQuerySchema,
    @Query('perLoading', zodPerLoadingQueryValidationPipe)
    perLoading: PerLoadingQuerySchema,
  ) {
    const response = await this.fetchQuestionComments.execute({
      questionId,
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
