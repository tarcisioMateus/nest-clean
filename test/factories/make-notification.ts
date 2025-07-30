import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mapper/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  )

  return notification
}

@Injectable()
export class NotificationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityID,
  ): Promise<Notification> {
    const notification = makeNotification(override, id)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    })

    return notification
  }
}
