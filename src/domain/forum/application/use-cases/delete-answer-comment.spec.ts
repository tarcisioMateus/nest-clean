import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    const { inMemoryAnswerCommentsRepository } =
      GetAllInMemoryRepositories.execute()

    answerCommentsRepository = inMemoryAnswerCommentsRepository

    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const comment = makeAnswerComment()

    await answerCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: comment.authorId.toString(),
      commentId: comment.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('should Not be able to delete another user answer comment', async () => {
    const comment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await answerCommentsRepository.create(comment)

    const response = await sut.execute({
      authorId: 'author-2',
      commentId: comment.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(answerCommentsRepository.items).toHaveLength(1)
  })
})
