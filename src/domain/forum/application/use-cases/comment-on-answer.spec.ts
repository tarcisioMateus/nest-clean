import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    const { inMemoryAnswerCommentsRepository, inMemoryAnswersRepository } =
      GetAllInMemoryRepositories.execute()

    answersRepository = inMemoryAnswersRepository
    answerCommentsRepository = inMemoryAnswerCommentsRepository

    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to create an answer comment', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const response = await sut.execute({
      answerId: answer.id.toString(),
      authorId: '1',
      content: 'New comment',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        answerComment: expect.objectContaining({ content: 'New comment' }),
      }),
    )
  })
})
