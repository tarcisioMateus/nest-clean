import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onQuestionCommentCreatedSendNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async onQuestionCommentCreatedSendNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `New Comment on: "${question.excerpt}"`,
        content: questionComment.excerpt,
      })
      console.log(`Question commentId: "${questionComment.id.toString()}"`)
    }
  }
}
