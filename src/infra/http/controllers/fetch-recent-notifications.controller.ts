import {
  Controller,
  Get,
  HttpCode,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common'

import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import {
  LoadingQuerySchema,
  zodLoadingQueryValidationPipe,
} from './input-schema/loading-query-schema'
import {
  PerLoadingQuerySchema,
  zodPerLoadingQueryValidationPipe,
} from './input-schema/per-loading-query-schema'

import { FetchRecentNotificationUseCase } from '@/domain/notification/application/use-cases/fetch-recent-notifications'
import { NotificationPresenter } from '../presenter/notification-presenter'

@Controller('/notification/:recipientId/')
export class FetchRecentNotificationsController {
  constructor(
    private readonly fetchRecentNotifications: FetchRecentNotificationUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async execute(
    @Param('recipientId', zodIdParamValidationPipe) recipientId: IdParamSchema,
    @Query('loading', zodLoadingQueryValidationPipe)
    loading: LoadingQuerySchema,
    @Query('perLoading', zodPerLoadingQueryValidationPipe)
    perLoading: PerLoadingQuerySchema,
  ) {
    console.log(loading)
    console.log(perLoading)
    const response = await this.fetchRecentNotifications.execute({
      loading,
      perLoading,
      recipientId,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }

    const notifications = response.value.notifications.map(
      NotificationPresenter.toHttp,
    )

    return { notifications }
  }
}
