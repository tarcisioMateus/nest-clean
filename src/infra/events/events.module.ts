import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

import { OnAnswerCommentCreated } from '@/domain/notification/application/subscribers/on-answer-comment-created'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { StorageModule } from '../storage/storage.module'
import { OnAttachmentsRemoved } from '@/domain/forum/application/subscribers/on-attachments-removed'

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    OnAnswerCommentCreated,
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    OnQuestionCommentCreated,
    SendNotificationUseCase,
    OnAttachmentsRemoved,
  ],
})
export class EventsModule {}
