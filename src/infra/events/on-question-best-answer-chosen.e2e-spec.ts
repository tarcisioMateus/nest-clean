import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'
import { DomainEvents } from '@/core/events/domain-events'

describe('On Question Best Answer Chosen E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should send notification upon choosing question best answer', async () => {
    const studentQuestion = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentQuestion.id,
    })
    const token = jwt.sign({ sub: studentQuestion.id.toString() })

    const studentAnswer = await studentFactory.makePrismaStudent()
    const answer = await answerFactory.makePrismaAnswer({
      authorId: studentAnswer.id,
      questionId: question.id,
    })

    await request(app.getHttpServer())
      .patch(`/answer/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${token}`)

    await vi.waitFor(async () => {
      const notificationOnDataBase = await prisma.notification.findFirst({
        where: {
          recipientId: studentAnswer.id.toString(),
        },
      })

      expect(notificationOnDataBase).not.toBeNull()
    })
  })
})
