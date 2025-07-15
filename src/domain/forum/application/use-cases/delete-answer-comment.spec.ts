import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const comment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: comment.authorId.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should Not be able to delete another user answer comment', async () => {
    const comment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: 'author-2',
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
  })
})
