import { QuestionWithDetails } from '@/domain/forum/enterprise/entities/value-objects/question-with-details'

export class QuestionWithDetailsPresenter {
  static toHttp(details: QuestionWithDetails) {
    return {
      question: {
        id: details.questionId.toString(),
        title: details.questionTitle,
        slug: details.questionSlug.value,
        created_at: details.questionCreatedAt,
        updated_at: details.questionUpdatedAt,
        content: details.questionContent,
        bestAnswerID: details.questionBestAnswerID?.toString(),
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
      answers: {
        length: details.answers.length,
        loaded: details.answers.loaded,
      },
    }
  }
}
