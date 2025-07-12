import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { SingUpController } from './controllers/sing-up.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [SingUpController],
  providers: [PrismaService],
})
export class AppModule {}
