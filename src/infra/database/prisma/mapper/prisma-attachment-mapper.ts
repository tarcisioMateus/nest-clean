import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.link,
        authorId: new UniqueEntityID(raw.authorId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toValue(),
      title: attachment.title,
      link: attachment.url,
      authorId: attachment.authorId.toString(),
    }
  }
}
