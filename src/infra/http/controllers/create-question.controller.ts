import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const zodValidationPipe = new ZodValidationPipe<CreateQuestionBodySchema>(
  createQuestionBodySchema,
)

@Controller('/question')
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async execute(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.prisma.question.create({
      data: { content, title, authorId: userId, slug: title },
    })
  }
}
