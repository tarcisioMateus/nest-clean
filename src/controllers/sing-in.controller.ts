import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { JwtService } from '@nestjs/jwt'

const singInBodySchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8).max(32),
})

type SingInBodySchema = z.infer<typeof singInBodySchema>

@Controller('/sing-in')
export class SingInController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe<SingInBodySchema>(singInBodySchema))
  async execute(@Body() body: SingInBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('credentials Error')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('credentials Error')
    }

    const token = this.jwt.sign({ sub: user.id })

    return { token }
  }
}
