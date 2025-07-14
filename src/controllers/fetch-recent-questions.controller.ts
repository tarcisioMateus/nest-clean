import { Controller, UseGuards, Query, Get } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { AuthGuard } from '@nestjs/passport'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

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
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async execute(
    @Query('page', zodPageQueryValidationPipe) page: PageQuerySchema,
  ) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
