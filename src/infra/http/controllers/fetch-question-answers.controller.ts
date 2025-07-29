import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { AnswerWithDetailsPresenter } from '../presenter/answer-with-details-presenter'
import {
  LoadingQuerySchema,
  zodLoadingQueryValidationPipe,
} from './input-schema/loading-query-schema'
import {
  PerLoadingQuerySchema,
  zodPerLoadingQueryValidationPipe,
} from './input-schema/per-loading-query-schema'

@Controller('/question/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersUseCase,
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
    const response = await this.fetchQuestionAnswers.execute({
      questionId,
      loading,
      perLoading,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const answers = response.value.answers.map(
      AnswerWithDetailsPresenter.toHttp,
    )

    return { answers }
  }
}
