import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

describe('Sing Ip E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let hashGenerator: HashGenerator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    hashGenerator = moduleRef.get(HashGenerator)
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
      data: { name, email, password: await hashGenerator.hash(password) },
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
