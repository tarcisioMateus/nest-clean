import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InvalidAttachmentFileTypeError } from './errors/invalid-attachment-file-type-error'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able upload an attachment', async () => {
    const response = await sut.execute({
      body: Buffer.from(''),
      fileName: 'example.png',
      fileType: 'image/png',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })

    expect(fakeUploader.items).toHaveLength(1)
    expect(fakeUploader.items[0]).toEqual({
      fileName: 'example.png',
      url: expect.any(String),
    })
  })

  it('should NOT be able upload an attachment with wrong type', async () => {
    const response = await sut.execute({
      body: Buffer.from(''),
      fileName: 'example.mp3',
      fileType: 'audio/mp3',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidAttachmentFileTypeError)
  })
})
