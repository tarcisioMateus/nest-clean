import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete an question comment', async () => {
    const comment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: comment.authorId.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should Not be able to delete another user question comment', async () => {
    const comment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: 'author-2',
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
  })
})
