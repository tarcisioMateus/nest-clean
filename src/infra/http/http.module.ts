import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { SingUpController } from './controllers/sing-up.controller'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

import { SingInController } from './controllers/sing-in.controller'
import { CreateSessionUseCase } from '@/domain/forum/application/use-cases/create-session'

import { CreateQuestionController } from './controllers/create-question.controller'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

import { EditQuestionController } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    SingUpController,
    SingInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    RegisterStudentUseCase,
    CreateSessionUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
