import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { DomainEvents } from '@/core/events/domain-events'
import {
  DeleteFile,
  deleteFileParams,
} from '@/domain/forum/application/storage/delete-file'
import { MockInstance } from 'vitest'

describe('On Attachments Removed E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let deleteFileSpy: MockInstance<(request: deleteFileParams) => Promise<void>>

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    // 2. Get the real service instance and spy on its method
    const deleteFileService = moduleRef.get(DeleteFile)
    deleteFileSpy = vi.spyOn(deleteFileService, 'deleteFile')

    DomainEvents.shouldRun = true

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should delete and attachment from cloud when dispatched the event', async () => {
    const student = await studentFactory.makePrismaStudent()

    const token = jwt.sign({ sub: student.id.toString() })

    // create and upload an attachments
    const responseUploader = await request(app.getHttpServer())
      .post('/attachment/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', './test/e2e/example-file.png')

    console.log(responseUploader.body)
    expect(responseUploader.statusCode).toBe(201)
    expect(responseUploader.body).toEqual({
      attachmentId: expect.any(String),
    })
    const attachmentId: string = responseUploader.body.attachmentId
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    })
    let url: string
    if (attachment) {
      url = attachment.link
    }

    // create question and makes the relation with pre-existing attachments
    const responseCreateQuestion = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'question 01',
        content: 'content',
        attachmentsId: [attachmentId.toString()],
      })

    expect(responseCreateQuestion.statusCode).toBe(201)
    const question = await prisma.question.findFirst({
      where: { title: 'question 01' },
    })
    expect(question).toBeTruthy()

    // dispatching the event using 1 of the 4 possible ways to do should
    if (question) {
      const response = await request(app.getHttpServer())
        .delete(`/question/${question.id.toString()}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(204)
      const deletedQuestion = await prisma.question.findUnique({
        where: { id: question.id.toString() },
      })
      expect(deletedQuestion).toBeNull()

      await vi.waitFor(() => {
        expect(deleteFileSpy).toHaveBeenCalledWith({ url })
      })
    }
  })
})
