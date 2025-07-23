import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
} from '@nestjs/common'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { AnswerPresenter } from '../presenter/answer-presenter'

@Controller('/question/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('questionId', zodIdParamValidationPipe) questionId: IdParamSchema,
  ) {
    const response = await this.fetchQuestionAnswers.execute({ questionId })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const answers = response.value.answers.map(AnswerPresenter.toHttp)

    return { answers }
  }
}
