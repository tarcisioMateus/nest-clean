import { Module } from '@nestjs/common'
import { SingUpController } from './controllers/sing-up.controller'
import { SingInController } from './controllers/sing-in.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { CreateSessionUseCase } from '@/domain/forum/application/use-cases/create-session'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    SingUpController,
    SingInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    CreateSessionUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
