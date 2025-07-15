import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to create an question comment', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

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
