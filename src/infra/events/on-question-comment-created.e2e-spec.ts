import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { DomainEvents } from '@/core/events/domain-events'

describe('On Question Comment Created E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should send notification upon question comment created', async () => {
    const studentQuestion = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentQuestion.id,
    })

    const studentComment = await studentFactory.makePrismaStudent()
    const token = jwt.sign({ sub: studentComment.id.toString() })
    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'comment content',
      })

    await vi.waitFor(async () => {
      const notificationOnDataBase = await prisma.notification.findFirst({
        where: {
          recipientId: studentQuestion.id.toString(),
        },
      })

      expect(notificationOnDataBase).not.toBeNull()
    })
  })
})
