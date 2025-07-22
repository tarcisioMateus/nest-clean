import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Question E2E', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
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

    const response = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'question 01',
        content: 'content',
      })

    expect(response.statusCode).toBe(201)
    const question = await prisma.question.findFirst({
      where: { title: 'question 01' },
    })
    expect(question).toBeTruthy()
  })
})
