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

import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'

import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    SingUpController,
    SingInController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
  ],
  providers: [
    RegisterStudentUseCase,
    CreateSessionUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
  ],
})
export class HttpModule {}
