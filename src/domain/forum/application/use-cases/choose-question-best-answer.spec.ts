import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository

let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    const { inMemoryAnswersRepository, inMemoryQuestionsRepository } =
      GetAllInMemoryRepositories.execute()

    questionsRepository = inMemoryQuestionsRepository
    answersRepository = inMemoryAnswersRepository

    sut = new ChooseQuestionBestAnswerUseCase(
      answersRepository,
      questionsRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const response = await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(questionsRepository.items).toHaveLength(1)
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should Not be able to choose another user best answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const response = await sut.execute({
      authorId: 'author-2',
      answerId: answer.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)

    expect(answersRepository.items).toHaveLength(1)
  })
})
