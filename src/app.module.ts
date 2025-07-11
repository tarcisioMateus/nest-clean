import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { SingUpController } from './controllers/sing-up.controller'

@Module({
  imports: [],
  controllers: [SingUpController],
  providers: [PrismaService],
})
export class AppModule {}
