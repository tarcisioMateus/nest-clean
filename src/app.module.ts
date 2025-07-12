import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { SingUpController } from './controllers/sing-up.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { SingInController } from './controllers/sing-in.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [SingUpController, SingInController],
  providers: [PrismaService],
})
export class AppModule {}
