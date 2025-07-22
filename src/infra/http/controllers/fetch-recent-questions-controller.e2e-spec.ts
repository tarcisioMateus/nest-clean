import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Recent Question E2E', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST/question e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    const question01 = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const question02 = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const response = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        questions: [
          expect.objectContaining({ title: question02.title }),
          expect.objectContaining({ title: question01.title }),
        ],
      }),
    )
  })
})
