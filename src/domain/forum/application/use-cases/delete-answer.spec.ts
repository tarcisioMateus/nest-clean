import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should Not be able to delete another user answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswersRepository.items).toHaveLength(1)
  })

  it('should be able to delete an answer with its attachments', async () => {
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
    await inMemoryAnswersRepository.create(answer)

    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)

    const response = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(null)
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })
})
