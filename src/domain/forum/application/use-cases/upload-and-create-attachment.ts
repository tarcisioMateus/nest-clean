import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Uploader, uploadParams } from '../storage/uploader'
import { InvalidAttachmentFileTypeError } from './errors/invalid-attachment-file-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'

type UploadAndCreateAttachmentUseCaseRequest = uploadParams

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentFileTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png|jpg)|^application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentFileTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    })

    const attachment = Attachment.create({ title: fileName, url })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
