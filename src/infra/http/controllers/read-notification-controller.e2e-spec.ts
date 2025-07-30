import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { NotificationFactory } from 'test/factories/make-notification'

describe('Read Notification E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('PATCH/notification/:id/read e2e', async () => {
    const student = await studentFactory.makePrismaStudent()

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: student.id,
    })

    const token = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/notification/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      notification: expect.objectContaining({
        content: notification.content,
      }),
    })
    const notificationOnDataBase = await prisma.notification.findUnique({
      where: { id: notification.id.toString() },
    })
    expect(notificationOnDataBase?.readAt).not.toBeNull()
  })
})
