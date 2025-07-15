import { Module } from '@nestjs/common'
import { SingUpController } from './controllers/sing-up.controller'
import { SingInController } from './controllers/sing-in.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    SingUpController,
    SingInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
