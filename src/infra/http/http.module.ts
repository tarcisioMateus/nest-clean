import { Module } from '@nestjs/common'
import { SingUpController } from './controllers/sing-up.controller'
import { SingInController } from './controllers/sing-in.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

@Module({
  imports: [DatabaseModule],
  controllers: [
    SingUpController,
    SingInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
