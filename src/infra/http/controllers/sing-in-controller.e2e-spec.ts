import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('Sing Ip E2E', () => {
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

  test('POST/sing-in e2e', async () => {
    const name = 'John Doe'
    const email = 'JohnDoe@email.com'
    const password = '12345678'

    await prisma.user.create({
      data: { name, email, password: await hash(password, 8) },
    })

    const response = await request(app.getHttpServer()).post('/sing-in').send({
      email,
      password,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    )
  })
})
