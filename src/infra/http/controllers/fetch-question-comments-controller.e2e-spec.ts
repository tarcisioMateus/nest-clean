import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Fetch Question Comment E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET/question/:questionId/comments e2e', async () => {
    const student = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const token = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const comment01 = await questionCommentFactory.makePrismaQuestionComment({
      authorId: student.id,
      questionId: question.id,
    })

    const comment02 = await questionCommentFactory.makePrismaQuestionComment({
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)

    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        {
          comment: expect.objectContaining({ id: comment01.id.toString() }),
          author: expect.objectContaining({ name: 'John Doe' }),
        },
        {
          comment: expect.objectContaining({ id: comment02.id.toString() }),
          author: expect.objectContaining({ name: 'John Doe' }),
        },
      ]),
    )
  })
})
