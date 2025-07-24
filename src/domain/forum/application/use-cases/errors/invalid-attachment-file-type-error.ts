import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachmentFileTypeError
  extends Error
  implements UseCaseError
{
  constructor(type: string) {
    super(`invalid attachment file type: "${type}".`)
  }
}
