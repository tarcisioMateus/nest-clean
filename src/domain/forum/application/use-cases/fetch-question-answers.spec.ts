import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let answersRepository: InMemoryAnswersRepository
let studentsRepository: InMemoryStudentsRepository

let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    const {
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryAnswerAttachmentsRepository,
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    } = GetAllInMemoryRepositories.execute()

    studentsRepository = inMemoryStudentsRepository
    questionsRepository = inMemoryQuestionsRepository
    attachmentsRepository = inMemoryAttachmentsRepository
    answerAttachmentsRepository = inMemoryAnswerAttachmentsRepository
    answerCommentsRepository = inMemoryAnswerCommentsRepository
    answersRepository = inMemoryAnswersRepository

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const attachment01 = makeAttachment({ authorId: student.id })
    const attachment02 = makeAttachment({ authorId: student.id })
    await attachmentsRepository.create(attachment01)
    await attachmentsRepository.create(attachment02)

    const answer = makeAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    const answer02 = makeAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    const answer03 = makeAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    await answersRepository.create(answer)
    await answersRepository.create(answer02)
    await answersRepository.create(answer03)

    const answerAttachment01 = makeAnswerAttachment({
      attachmentId: attachment01.id,
      answerId: answer.id,
    })
    const answerAttachment02 = makeAnswerAttachment({
      attachmentId: attachment02.id,
      answerId: answer.id,
    })
    await answerAttachmentsRepository.createMany([
      answerAttachment01,
      answerAttachment02,
    ])

    const comment01 = makeAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })
    const comment02 = makeAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })
    await answerCommentsRepository.create(comment01)
    await answerCommentsRepository.create(comment02)

    const response = await sut.execute({ questionId: question.id.toString() })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.answers).toHaveLength(3)
      expect(response.value.answers).toEqual(
        expect.arrayContaining([
          {
            props: {
              answer: expect.objectContaining({
                id: answer.id,
                content: answer.content,
              }),
              comments: { length: 2 },
              author: { id: student.id, name: 'John Doe' },
              attachments: expect.arrayContaining([
                {
                  id: attachment01.id,
                  url: attachment01.url,
                  title: attachment01.title,
                },
              ]),
            },
          },
          {
            props: {
              answer: expect.objectContaining({
                id: answer02.id,
                content: answer02.content,
              }),
              comments: { length: 0 },
              author: { id: student.id, name: 'John Doe' },
              attachments: expect.arrayContaining([]),
            },
          },
        ]),
      )
    }
  })

  it('should be able to fetch/load paginated answers', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    for (let i = 0; i < 21; i++) {
      const answer = makeAnswer({
        authorId: student.id,
        questionId: question.id,
      })
      await answersRepository.create(answer)
    }

    const answer22 = makeAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    const answer23 = makeAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    await answersRepository.create(answer22)
    await answersRepository.create(answer23)

    const response = await sut.execute({
      questionId: question.id.toString(),
      loading: 8,
      perLoading: 3,
    })
    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.answers).toHaveLength(2)
      expect(response.value.answers).toEqual(
        expect.arrayContaining([
          {
            props: {
              answer: expect.objectContaining({
                id: answer22.id,
                content: answer22.content,
              }),
              comments: { length: 0 },
              author: { id: student.id, name: 'John Doe' },
              attachments: expect.arrayContaining([]),
            },
          },
          {
            props: {
              answer: expect.objectContaining({
                id: answer23.id,
                content: answer23.content,
              }),
              comments: { length: 0 },
              author: { id: student.id, name: 'John Doe' },
              attachments: expect.arrayContaining([]),
            },
          },
        ]),
      )
    }
  })
})
