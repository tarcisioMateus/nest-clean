import { LoadingParams } from '@/core/repositories/loading-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async findManyRecentByRecipientId(
    recipientId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Notification[]> {
    const recipientNotification = this.items.filter(
      (item) => item.recipientId.toString() === recipientId,
    )

    const unreadNotifications = recipientNotification
      .filter((n) => n.readAt == null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort unread by newest first

    const readNotifications = recipientNotification
      .filter((n) => !unreadNotifications.find((uN) => uN.id.equals(n.id)))
      .sort(
        (a, b) => (b.readAt as Date).getTime() - (a.readAt as Date).getTime(),
      ) // Sort read by newest first

    // 2. Concatenate the two arrays together, with the unread ones first
    const sortedNotifications = unreadNotifications
      .concat(readNotifications)
      .slice((loading - 1) * perLoading, loading * perLoading)

    return sortedNotifications
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(
      (item) => item.id.toValue() === notification.id.toValue(),
    )

    this.items[notificationIndex] = notification
  }
}
