import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mapper/prisma-notification-mapper'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { LoadingParams } from '@/core/repositories/loading-params'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async findManyRecentByRecipientId(
    recipientId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: {
        readAt: {
          sort: 'desc',
          nulls: 'first',
        },
      },
      skip: (loading - 1) * perLoading,
      take: perLoading,
    })

    return notifications.map(PrismaNotificationMapper.toDomain)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.prisma.notification.update({
      where: { id: notification.id.toValue() },
      data,
    })
  }
}
