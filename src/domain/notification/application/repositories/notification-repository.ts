import { LoadingParams } from '@/core/repositories/loading-params'
import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract findById(id: string): Promise<Notification | null>
  abstract findManyRecentByRecipientId(
    recipientId: string,
    { loading, perLoading }: LoadingParams,
  ): Promise<Notification[]>

  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
