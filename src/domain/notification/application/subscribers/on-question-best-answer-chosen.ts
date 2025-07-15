import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onQuestionBestAnswerChosenSendNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async onQuestionBestAnswerChosenSendNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Your Answer was chosen!`,
        content: `Your answer on: "${question.title.substring(40).concat('...')}"`,
      })
      console.log(`bestAnswerID: "${bestAnswerId.toString()}"`)
    }
  }
}
