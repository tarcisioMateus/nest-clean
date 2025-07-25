import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Uploader, uploadParams } from '../storage/uploader'
import { InvalidAttachmentFileTypeError } from './errors/invalid-attachment-file-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface UploadAndCreateAttachmentUseCaseRequest extends uploadParams {
  authorId: string
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentFileTypeError | NotAllowedError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
    authorId,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png|jpg)|^application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentFileTypeError(fileType))
    }

    const student = await this.studentsRepository.findById(authorId)
    if (!student) {
      return left(new NotAllowedError())
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    })

    const attachment = Attachment.create({ title: fileName, url, authorId })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
