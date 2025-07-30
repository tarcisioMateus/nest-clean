import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
