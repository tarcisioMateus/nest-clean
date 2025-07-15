import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Recent Question E2E', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST/question e2e', async () => {
    const name = 'John Doe'
    const email = 'JohnDoe@email.com'
    const password = '12345678'

    const user = await prisma.user.create({
      data: { name, email, password: await hash(password, 8) },
    })

    const token = jwt.sign({ sub: user.id })

    await prisma.question.create({
      data: {
        title: 'question-01',
        content: 'content',
        slug: 'question-01',
        authorId: user.id,
      },
    })
    await prisma.question.create({
      data: {
        title: 'question-02',
        content: 'content',
        slug: 'question-02',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        questions: [
          expect.objectContaining({ title: 'question-02' }),
          expect.objectContaining({ title: 'question-01' }),
        ],
      }),
    )
  })
})
