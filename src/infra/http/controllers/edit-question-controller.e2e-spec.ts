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
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'

describe('Edit Question E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionFactory: QuestionFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AttachmentFactory,
        QuestionFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('PUT/question/:id e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    // create attachments only connected to user
    const attachment01 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const attachment02 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })

    // create question
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    // connect previously created attachments with question
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment01.id,
      questionId: question.id,
    })
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment02.id,
      questionId: question.id,
    })

    // create more attachments connected only to user
    const attachment03 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const attachment04 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })

    // update the question, deleting 1 of the previous linked attachment, and connection 2 more attachments
    const response = await request(app.getHttpServer())
      .put(`/question/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'question 01',
        content: 'updated content',
        attachmentsId: [
          attachment01.id.toString(),
          attachment03.id.toString(),
          attachment04.id.toString(),
        ],
      })

    // check if question content was updated
    expect(response.statusCode).toBe(204)
    const updatedQuestion = await prisma.question.findUnique({
      where: { id: question.id.toString() },
    })
    expect(updatedQuestion).toEqual(
      expect.objectContaining({
        content: 'updated content',
        title: 'question 01',
      }),
    )

    // check if question attachments was updated
    const attachmentsLinkedToQuestionOnDatabase =
      await prisma.attachment.findMany({
        where: {
          questionId: question.id.toString(),
        },
      })
    expect(attachmentsLinkedToQuestionOnDatabase).toHaveLength(3)
    expect(attachmentsLinkedToQuestionOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment01.id.toString() }),
        expect.objectContaining({ id: attachment03.id.toString() }),
        expect.objectContaining({ id: attachment04.id.toString() }),
      ]),
    )
  })
})
