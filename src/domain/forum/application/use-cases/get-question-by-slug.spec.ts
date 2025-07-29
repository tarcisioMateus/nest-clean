import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeAnswer } from 'test/factories/make-answer'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let answersRepository: InMemoryAnswersRepository
let studentsRepository: InMemoryStudentsRepository

let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    const {
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryQuestionCommentsRepository,
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    } = GetAllInMemoryRepositories.execute()

    studentsRepository = inMemoryStudentsRepository
    questionsRepository = inMemoryQuestionsRepository
    attachmentsRepository = inMemoryAttachmentsRepository
    questionAttachmentsRepository = inMemoryQuestionAttachmentsRepository
    questionCommentsRepository = inMemoryQuestionCommentsRepository
    answersRepository = inMemoryAnswersRepository

    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get an question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await studentsRepository.create(student)

    const attachment01 = makeAttachment({ authorId: student.id })
    const attachment02 = makeAttachment({ authorId: student.id })
    await attachmentsRepository.create(attachment01)
    await attachmentsRepository.create(attachment02)

    const slug = Slug.create('question-title')
    const question = makeQuestion({
      slug,
      authorId: student.id,
    })
    await questionsRepository.create(question)

    const questionAttachment01 = makeQuestionAttachment({
      attachmentId: attachment01.id,
      questionId: question.id,
    })
    const questionAttachment02 = makeQuestionAttachment({
      attachmentId: attachment02.id,
      questionId: question.id,
    })
    await questionAttachmentsRepository.createMany([
      questionAttachment01,
      questionAttachment02,
    ])

    const comment01 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment02 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    await questionCommentsRepository.create(comment01)
    await questionCommentsRepository.create(comment02)

    const answer = makeAnswer({ authorId: student.id, questionId: question.id })
    await answersRepository.create(answer)

    const response = await sut.execute({
      slug: slug.value,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value.details).toEqual({
        props: {
          question: expect.objectContaining({
            id: question.id,
            slug: question.slug,
          }),
          comments: { length: 2 },
          answers: { length: 1, loaded: 0 },
          author: { id: student.id, name: 'John Doe' },
          attachments: expect.arrayContaining([
            {
              id: attachment01.id,
              url: attachment01.url,
              title: attachment01.title,
            },
          ]),
        },
      })
    }
  })
})
