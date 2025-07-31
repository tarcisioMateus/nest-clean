import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { NotificationFactory } from 'test/factories/make-notification'
import { hashSync } from 'bcryptjs'

describe('Fetch Recent Notification E2E', () => {
  let app: INestApplication
  let jwt: JwtService
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
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET/notification/:recipientId e2e', async () => {
    const student = await studentFactory.makePrismaStudent({
      password: hashSync('123456789', 8),
    })

    for (let i = 1; i < 11; i++) {
      await notificationFactory.makePrismaNotification({
        recipientId: student.id,
        readAt: new Date(2025, 7, i),
      })
    }
    for (let i = 1; i < 5; i++) {
      await notificationFactory.makePrismaNotification({
        recipientId: student.id,
        readAt: null,
      })
    }

    const token = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/notification/${student.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .query({
        perLoading: 3,
        loading: 1,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({
          readAt: null,
        }),
      ]),
    })

    const response2 = await request(app.getHttpServer())
      .get(`/notification/${student.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .query({
        perLoading: 6,
        loading: 3,
      })

    expect(response2.statusCode).toBe(200)
    expect(response2.body).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({
          readAt: new Date(2025, 7, 1).toISOString(),
        }),
        expect.objectContaining({
          readAt: new Date(2025, 7, 2).toISOString(),
        }),
      ]),
    })
  })
})
