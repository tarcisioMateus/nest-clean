import {
  Controller,
  Query,
  Get,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenter/question-presenter'

const PageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQuerySchema = z.infer<typeof PageQuerySchema>

const zodPageQueryValidationPipe = new ZodValidationPipe<PageQuerySchema>(
  PageQuerySchema,
)

@Controller('/question')
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Query('page', zodPageQueryValidationPipe) page: PageQuerySchema,
  ) {
    const response = await this.fetchRecentQuestions.execute({ page })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    const questions = response.value.questions.map(QuestionPresenter.toHttp)

    return { questions }
  }
}
