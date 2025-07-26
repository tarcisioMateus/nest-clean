import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Create Question E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST/question e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    // create attachments only connected to user
    const attachment01 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })
    const attachment02 = await attachmentFactory.makePrismaAttachment({
      authorId: student.id,
    })

    // create question and makes the relation with pre-existing attachments
    const response = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'question 01',
        content: 'content',
        attachmentsId: [attachment01.id.toString(), attachment02.id.toString()],
      })

    // check if question was created
    expect(response.statusCode).toBe(201)
    const question = await prisma.question.findFirst({
      where: { title: 'question 01' },
    })
    expect(question).toBeTruthy()

    // check if was made connection of attachments with question
    const attachmentsLinkedToQuestionOnDatabase =
      await prisma.attachment.findMany({
        where: {
          questionId: question?.id,
        },
      })
    expect(attachmentsLinkedToQuestionOnDatabase).toHaveLength(2)
    expect(attachmentsLinkedToQuestionOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment01.id.toString() }),
        expect.objectContaining({ id: attachment02.id.toString() }),
      ]),
    )
  })
})
