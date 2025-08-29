import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { OnAttachmentsRemoved } from './on-attachments-removed'
import { MockInstance } from 'vitest'
import { deleteFileParams } from '../storage/delete-file'
import { EditQuestionUseCase } from '../use-cases/edit-question'
import { EditAnswerUseCase } from '../use-cases/edit-answer'
import { DeleteQuestionUseCase } from '../use-cases/delete-question'
import { DeleteAnswerUseCase } from '../use-cases/delete-answer'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let fakeUploader: FakeUploader

let editQuestion: EditQuestionUseCase
let deleteQuestion: DeleteQuestionUseCase
let editAnswer: EditAnswerUseCase
let deleteAnswer: DeleteAnswerUseCase

let sut: OnAttachmentsRemoved // eslint-disable-line
let onFakerUploaderDeleteFileSpy: MockInstance<
  (request: deleteFileParams) => Promise<void>
>

describe('On Attachments Removed', () => {
  beforeEach(() => {
    const {
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryAnswerAttachmentsRepository,
      inMemoryAnswersRepository,
    } = GetAllInMemoryRepositories.execute()
    studentsRepository = inMemoryStudentsRepository
    attachmentsRepository = inMemoryAttachmentsRepository
    questionsRepository = inMemoryQuestionsRepository
    questionAttachmentsRepository = inMemoryQuestionAttachmentsRepository
    answerAttachmentsRepository = inMemoryAnswerAttachmentsRepository
    answersRepository = inMemoryAnswersRepository

    fakeUploader = new FakeUploader()
    onFakerUploaderDeleteFileSpy = vi.spyOn(fakeUploader, 'deleteFile')
    sut = new OnAttachmentsRemoved(fakeUploader)
  })

  it('should be able to delete an attachment from CLOUD when updating an question', async () => {
    editQuestion = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
      attachmentsRepository,
    )
    const student = makeStudent()
    await studentsRepository.create(student)

    // the cloud starts empty
    expect(fakeUploader.items).toHaveLength(0)

    const { url } = await fakeUploader.upload({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
    })
    const attachment1 = makeAttachment({
      authorId: student.id,
      url,
      title: 'example.png',
    })
    await attachmentsRepository.create(attachment1)
    // the cloud has an attachment
    expect(fakeUploader.items).toHaveLength(1)

    const question = makeQuestion({ authorId: student.id })
    const questionAttachment1 = makeQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment1.id,
    })
    question.attachments = new QuestionAttachmentList([questionAttachment1])
    await questionsRepository.create(question)

    await editQuestion.execute({
      questionId: question.id.toString(),
      authorId: student.id.toString(),
      title: 'title1',
      content: 'content1',
      attachmentsId: [],
    })

    await vi.waitFor(() => {
      expect(onFakerUploaderDeleteFileSpy).toHaveBeenCalled()
      expect(fakeUploader.items).toHaveLength(0)
    })
  })

  it('should be able to delete an attachment from CLOUD when deleting an question', async () => {
    deleteQuestion = new DeleteQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
      attachmentsRepository,
    )
    const student = makeStudent()
    await studentsRepository.create(student)

    // the cloud starts empty
    expect(fakeUploader.items).toHaveLength(0)

    const { url } = await fakeUploader.upload({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
    })
    const attachment1 = makeAttachment({
      authorId: student.id,
      url,
      title: 'example.png',
    })
    await attachmentsRepository.create(attachment1)
    // the cloud has an attachment
    expect(fakeUploader.items).toHaveLength(1)

    const question = makeQuestion({ authorId: student.id })
    const questionAttachment1 = makeQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment1.id,
    })
    question.attachments = new QuestionAttachmentList([questionAttachment1])
    await questionsRepository.create(question)

    await deleteQuestion.execute({
      questionId: question.id.toString(),
      authorId: student.id.toString(),
    })

    await vi.waitFor(() => {
      expect(onFakerUploaderDeleteFileSpy).toHaveBeenCalled()
      expect(fakeUploader.items).toHaveLength(0)
    })
  })

  it('should be able to delete an attachment from CLOUD when updating an answer', async () => {
    editAnswer = new EditAnswerUseCase(
      answersRepository,
      answerAttachmentsRepository,
      attachmentsRepository,
    )
    const student = makeStudent()
    await studentsRepository.create(student)

    // the cloud starts empty
    expect(fakeUploader.items).toHaveLength(0)

    const { url } = await fakeUploader.upload({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
    })
    const attachment1 = makeAttachment({
      authorId: student.id,
      url,
      title: 'example.png',
    })
    await attachmentsRepository.create(attachment1)
    // the cloud has an attachment
    expect(fakeUploader.items).toHaveLength(1)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const answer = makeAnswer({ authorId: student.id })
    const answerAttachment1 = makeAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    })
    answer.attachments = new AnswerAttachmentList([answerAttachment1])
    await answersRepository.create(answer)

    await editAnswer.execute({
      answerId: answer.id.toString(),
      authorId: student.id.toString(),
      content: 'content1',
      attachmentsId: [],
    })

    await vi.waitFor(() => {
      expect(onFakerUploaderDeleteFileSpy).toHaveBeenCalled()
      expect(fakeUploader.items).toHaveLength(0)
    })
  })

  it('should be able to delete an attachment from CLOUD when deleting an answer', async () => {
    deleteAnswer = new DeleteAnswerUseCase(
      answersRepository,
      answerAttachmentsRepository,
      attachmentsRepository,
    )
    const student = makeStudent()
    await studentsRepository.create(student)

    // the cloud starts empty
    expect(fakeUploader.items).toHaveLength(0)

    const { url } = await fakeUploader.upload({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
    })
    const attachment1 = makeAttachment({
      authorId: student.id,
      url,
      title: 'example.png',
    })
    await attachmentsRepository.create(attachment1)
    // the cloud has an attachment
    expect(fakeUploader.items).toHaveLength(1)

    const question = makeQuestion({ authorId: student.id })
    await questionsRepository.create(question)

    const answer = makeAnswer({ authorId: student.id })
    const answerAttachment1 = makeAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    })
    answer.attachments = new AnswerAttachmentList([answerAttachment1])
    await answersRepository.create(answer)

    await deleteAnswer.execute({
      answerId: answer.id.toString(),
      authorId: student.id.toString(),
    })

    await vi.waitFor(() => {
      expect(onFakerUploaderDeleteFileSpy).toHaveBeenCalled()
      expect(fakeUploader.items).toHaveLength(0)
    })
  })
})
