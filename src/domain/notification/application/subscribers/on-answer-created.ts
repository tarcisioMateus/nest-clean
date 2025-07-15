import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onAnswerCreatedSendNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async onAnswerCreatedSendNotification({
    answer,
  }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `New Answer on: "${question.title.substring(40).concat('...')}"`,
        content: answer.excerpt,
      })
      console.log(`AnswerID: "${answer.id.toString()}"`)
    }
  }
}
