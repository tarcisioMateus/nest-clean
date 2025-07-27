import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Answer Question E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST/question/:questionId/answer e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    // create attachments only connected to user
    const attachment01 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const attachment02 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })

    // create answer and makes the relation with pre-existing attachments
    const response = await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'content',
        attachmentsId: [attachment01.id.toString(), attachment02.id.toString()],
      })

    // check if answer was created
    expect(response.statusCode).toBe(201)
    const answer = await prisma.answer.findFirst({
      where: { content: 'content' },
    })
    expect(answer).toBeTruthy()

    // check if was made connection of attachments with answer
    const attachmentsLinkedToAnswerOnDatabase =
      await prisma.attachment.findMany({
        where: {
          answerId: answer?.id,
        },
      })
    expect(attachmentsLinkedToAnswerOnDatabase).toHaveLength(2)
    expect(attachmentsLinkedToAnswerOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment01.id.toString() }),
        expect.objectContaining({ id: attachment02.id.toString() }),
      ]),
    )
  })
})
