import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: Slug): Promise<Question | null>
  abstract fetchManyRecent({
    page,
    perPage,
  }: PaginationParams): Promise<Question[]>

  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
