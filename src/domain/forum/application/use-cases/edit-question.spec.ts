import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    const {
      inMemoryQuestionAttachmentsRepository,
      inMemoryQuestionsRepository,
    } = GetAllInMemoryRepositories.execute()

    questionsRepository = inMemoryQuestionsRepository
    questionAttachmentsRepository = inMemoryQuestionAttachmentsRepository

    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit an question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const response = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
      attachmentsId: [],
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(questionsRepository.items[0]).toMatchObject({
      title: 'new title',
      content: 'new content',
    })
  })

  it('should Not be able to edit another user question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const response = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
      attachmentsId: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(questionsRepository.items).toHaveLength(1)
  })

  it('should be able to edit an question with its attachments', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    const attachments = [
      makeQuestionAttachment({
        questionId: new UniqueEntityID('question-1'),
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: new UniqueEntityID('question-1'),
        attachmentId: new UniqueEntityID('2'),
      }),
    ]

    question.attachments = new QuestionAttachmentList(attachments)
    await questionsRepository.create(question)

    const response = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'new title',
      content: 'new content',
      attachmentsId: ['2', '3', '4'],
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(questionsRepository.items[0]).toMatchObject({
      title: 'new title',
      content: 'new content',
    })
    expect(questionAttachmentsRepository.items).toHaveLength(3)
    expect(questionAttachmentsRepository.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('4') }),
    ])
  })
})
