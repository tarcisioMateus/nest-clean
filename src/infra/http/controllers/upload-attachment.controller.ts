import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InvalidAttachmentFileTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-file-type-error'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachment/upload')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async execute(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: '.(jpeg|png|jpg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const authorId = user.sub

    const response = await this.uploadAndCreateAttachment.execute({
      authorId,
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    })

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(response.value.message)
        case InvalidAttachmentFileTypeError:
          throw new BadRequestException(response.value.message)
        default:
          throw new BadRequestException(response.value.message)
      }
    }

    const { attachment } = response.value

    return { attachmentId: attachment.id.toString() }
  }
}
