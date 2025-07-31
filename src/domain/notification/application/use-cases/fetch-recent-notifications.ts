import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notification-repository'
import { Injectable } from '@nestjs/common'
import { Notification } from '../../enterprise/entities/notification'
import {
  LoadingParams,
  DEFAULT_LOADING,
  DEFAULT_PER_LOADING,
} from '@/core/repositories/loading-params'
import { Optional } from '@/core/types/optional'

interface FetchRecentNotificationUseCaseRequest extends LoadingParams {
  recipientId: string
}

type FetchRecentNotificationUseCaseResponse = Either<
  null,
  { notifications: Notification[] }
>

@Injectable()
export class FetchRecentNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    loading,
    perLoading,
  }: Optional<
    FetchRecentNotificationUseCaseRequest,
    'loading' | 'perLoading'
  >): Promise<FetchRecentNotificationUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findManyRecentByRecipientId(
        recipientId,
        {
          loading: loading ?? DEFAULT_LOADING,
          perLoading: perLoading ?? DEFAULT_PER_LOADING,
        },
      )

    return right({ notifications })
  }
}
