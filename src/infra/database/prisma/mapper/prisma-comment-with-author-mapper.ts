import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}
export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      comment: {
        content: raw.content,
        createdAt: raw.createdAt,
        id: new UniqueEntityID(raw.id),
        updatedAt: raw.updatedAt,
      },
      author: {
        id: new UniqueEntityID(raw.author.id),
        name: raw.author.name,
      },
    })
  }
}
