import { AnswerWithDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-with-details'

export class AnswerWithDetailsPresenter {
  static toHttp(details: AnswerWithDetails) {
    return {
      answer: {
        id: details.answerId.toString(),
        created_at: details.answerCreatedAt,
        updated_at: details.answerUpdatedAt,
        content: details.answerContent,
      },
      attachments: details.attachments.map((attachment) => {
        return {
          id: attachment.id.toString(),
          title: attachment.title,
          url: attachment.url,
        }
      }),
      author: {
        id: details.authorId.toString(),
        name: details.authorName,
      },
      comments: {
        length: details.commentsLength,
      },
    }
  }
}
