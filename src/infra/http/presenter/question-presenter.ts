import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHttp(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    }
  }
}
