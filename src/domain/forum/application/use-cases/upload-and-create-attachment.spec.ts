import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InvalidAttachmentFileTypeError } from './errors/invalid-attachment-file-type-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { GetAllInMemoryRepositories } from 'test/repositories/get-all-in-memory-repository'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    const { inMemoryStudentsRepository, inMemoryAttachmentsRepository } =
      GetAllInMemoryRepositories.execute()
    studentsRepository = inMemoryStudentsRepository
    attachmentsRepository = inMemoryAttachmentsRepository

    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      studentsRepository,
      attachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload an attachment', async () => {
    const student = makeStudent()
    await studentsRepository.create(student)

    const response = await sut.execute({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
      authorId: student.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })

    expect(fakeUploader.items).toHaveLength(1)
    expect(fakeUploader.items[0]).toEqual({
      fileName: 'example.png',
      url: expect.any(String),
    })
  })

  it('should NOT be able upload an attachment with wrong type', async () => {
    const student = makeStudent()
    await studentsRepository.create(student)

    const response = await sut.execute({
      body: Buffer.from(''),
      fileName: 'example.mp3',
      fileType: 'audio/mp3',
      authorId: student.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidAttachmentFileTypeError)
  })

  it('should Not be able to create an attachment an invalid student ', async () => {
    const response = await sut.execute({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
      authorId: 'invalid-student-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
