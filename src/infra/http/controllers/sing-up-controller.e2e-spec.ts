import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Sing Up E2E', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST/sing-up e2e', async () => {
    const response = await request(app.getHttpServer()).post('/sing-up').send({
      name: 'John Doe',
      email: 'JohnDoe@email.com',
      password: '12345678',
    })

    expect(response.statusCode).toBe(201)
    expect(
      prisma.user.findUnique({ where: { email: 'JohnDoe@email.com' } }),
    ).toBeTruthy()
  })
})
