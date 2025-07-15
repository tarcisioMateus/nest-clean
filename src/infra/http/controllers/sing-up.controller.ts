import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const singUpBodySchema = z.object({
  name: z.string(),
  email: z.email().trim(),
  password: z.string().min(8).max(32),
})

type SingUpBodySchema = z.infer<typeof singUpBodySchema>

@Controller('/sing-up')
export class SingUpController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe<SingUpBodySchema>(singUpBodySchema))
  async execute(@Body() body: SingUpBodySchema) {
    const { name, email, password } = body

    const userWithEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithEmail) {
      throw new ConflictException('email unavailable')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  }
}
