import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from 'test/factories/make-answer'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'

describe('Fetch Question Answers E2E', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET/question/:questionId/answers e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const attachment01 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const answer01 = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer01.id,
      attachmentId: attachment01.id,
    })

    const answer02 = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: [
        {
          answer: expect.objectContaining({ id: answer02.id.toString() }),
          author: { id: student.id.toString(), name: student.name },
          comments: { length: 0 },
          attachments: [],
        },
        {
          answer: expect.objectContaining({ id: answer01.id.toString() }),
          author: { id: student.id.toString(), name: student.name },
          comments: { length: 0 },
          attachments: [
            {
              id: attachment01.id.toString(),
              url: attachment01.url,
              title: attachment01.title,
            },
          ],
        },
      ],
    })
  })
})
