import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    const { inMemoryQuestionCommentsRepository, inMemoryQuestionsRepository } =
      GetAllInMemoryRepositories.execute()

    questionsRepository = inMemoryQuestionsRepository
    questionCommentsRepository = inMemoryQuestionCommentsRepository

    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to create an question comment', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id.toString(),
      authorId: '1',
      content: 'New comment',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        questionComment: expect.objectContaining({ content: 'New comment' }),
      }),
    )
  })
})
