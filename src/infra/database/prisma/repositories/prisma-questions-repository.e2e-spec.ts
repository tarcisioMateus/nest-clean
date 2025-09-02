import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

describe('Prisma Questions Repository E2E', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    questionsRepository = moduleRef.get(QuestionsRepository)
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should cache question details', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const { slug } = question

    await questionsRepository.findDetailsBySlug(slug)

    const cache = await cacheRepository.get(`question:${slug.value}:details`)
    if (!cache) {
      throw new Error()
    }

    expect(JSON.parse(cache)).toEqual(
      expect.objectContaining({
        id: question.id.toString(),
      }),
    )
  })

  it('should return cached question details on subsequent calls', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const { slug } = question

    await questionsRepository.findDetailsBySlug(slug)

    const cache = await cacheRepository.get(`question:${slug.value}:details`)
    if (!cache) {
      throw new Error()
    }
    const updatedCache = JSON.parse(cache)
    updatedCache.content = ' '
    updatedCache.title = ' '

    await cacheRepository.set(
      `question:${slug.value}:details`,
      JSON.stringify(updatedCache),
    )

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(questionDetails?.questionContent).toEqual(' ')
    expect(questionDetails?.questionTitle).toEqual(' ')
  })

  it('should delete cached when question is saved/updated', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const { slug } = question

    await cacheRepository.set(
      `question:${slug.value}:details`,
      JSON.stringify({ empty: true }),
    )
    await questionsRepository.save(question)

    const cache = await cacheRepository.get(`question:${slug.value}:details`)

    expect(cache).toBeNull()
  })

  it('should delete cached when question is deleted', async () => {
    const student = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const { slug } = question

    await cacheRepository.set(
      `question:${slug.value}:details`,
      JSON.stringify({ empty: true }),
    )
    await questionsRepository.delete(question)

    const cache = await cacheRepository.get(`question:${slug.value}:details`)

    expect(cache).toBeNull()
  })
})
