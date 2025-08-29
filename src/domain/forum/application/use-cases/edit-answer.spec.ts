import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    const {
      inMemoryAnswerAttachmentsRepository,
      inMemoryAnswersRepository,
      inMemoryAttachmentsRepository,
    } = GetAllInMemoryRepositories.execute()

    answerAttachmentsRepository = inMemoryAnswerAttachmentsRepository
    answersRepository = inMemoryAnswersRepository
    attachmentsRepository = inMemoryAttachmentsRepository

    sut = new EditAnswerUseCase(
      answersRepository,
      answerAttachmentsRepository,
      attachmentsRepository,
    )
  })

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsId: [],
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(answersRepository.items[0]).toMatchObject({
      content: 'new content',
    })
  })

  it('should Not be able to edit another user answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsId: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(answersRepository.items).toHaveLength(1)
  })

  it('should be able to edit an answer with its attachments', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    const attachments = [
      makeAnswerAttachment({
        answerId: new UniqueEntityID('answer-1'),
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: new UniqueEntityID('answer-1'),
        attachmentId: new UniqueEntityID('2'),
      }),
    ]

    answer.attachments = new AnswerAttachmentList(attachments)
    await answersRepository.create(answer)

    const response = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsId: ['2', '3', '4'],
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(answersRepository.items[0]).toMatchObject({
      content: 'new content',
    })
    expect(answerAttachmentsRepository.items).toHaveLength(3)
    expect(answerAttachmentsRepository.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('4') }),
    ])
  })
})
