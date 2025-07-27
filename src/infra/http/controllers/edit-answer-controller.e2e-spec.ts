import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'

describe('Edit Answer E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let answerFactory: AnswerFactory
  let answerAttachmentFactory: AnswerAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        AnswerFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('PUT/answer/:id e2e', async () => {
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

    // create answer
    const answer = await answerFactory.makePrismaAnswer({
      authorId: student.id,
      questionId: question.id,
    })

    // connect previously created attachments with answer
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment01.id,
      answerId: answer.id,
    })
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment02.id,
      answerId: answer.id,
    })

    // create more attachments connected only to user
    const attachment03 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const attachment04 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })

    // update the answer, deleting 1 of the previous linked attachment, and connection 2 more attachments
    const response = await request(app.getHttpServer())
      .put(`/answer/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'updated content',
        attachmentsId: [
          attachment01.id.toString(),
          attachment03.id.toString(),
          attachment04.id.toString(),
        ],
      })

    // check if answer content was updated
    expect(response.statusCode).toBe(204)
    const updatedAnswer = await prisma.answer.findUnique({
      where: { id: answer.id.toString() },
    })
    expect(updatedAnswer).toEqual(
      expect.objectContaining({
        content: 'updated content',
      }),
    )

    // check if answer attachments was updated
    const attachmentsLinkedToAnswerOnDatabase =
      await prisma.attachment.findMany({
        where: {
          answerId: answer.id.toString(),
        },
      })
    expect(attachmentsLinkedToAnswerOnDatabase).toHaveLength(3)
    expect(attachmentsLinkedToAnswerOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment01.id.toString() }),
        expect.objectContaining({ id: attachment03.id.toString() }),
        expect.objectContaining({ id: attachment04.id.toString() }),
      ]),
    )
  })
})
