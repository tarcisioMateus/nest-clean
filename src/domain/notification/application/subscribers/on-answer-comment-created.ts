import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onAnswerCommentCreatedSendNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async onAnswerCommentCreatedSendNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `New Comment on: "${answer.excerpt}"`,
        content: answerComment.excerpt,
      })
      console.log(`Answer commentId: "${answerComment.id.toString()}"`)
    }
  }
}
