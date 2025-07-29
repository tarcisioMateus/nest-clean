import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import {
  slugParamSchema,
  SlugParamSchema,
} from './input-schema/slug-param-schema'
import { QuestionWithDetailsPresenter } from '../presenter/question-with-details.presenter'

const zodPageQueryValidationPipe = new ZodValidationPipe<SlugParamSchema>(
  slugParamSchema,
)

@Controller('/question/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('slug', zodPageQueryValidationPipe) slug: SlugParamSchema,
  ) {
    const response = await this.getQuestionBySlugUseCase.execute({ slug })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const details = QuestionWithDetailsPresenter.toHttp(response.value.details)

    return { details }
  }
}
