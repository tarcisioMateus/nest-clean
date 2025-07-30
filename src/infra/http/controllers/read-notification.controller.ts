import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  IdParamSchema,
  zodIdParamValidationPipe,
} from './input-schema/id-param-schema'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { NotificationPresenter } from '../presenter/notification-presenter'

@Controller('/notification/:id/read')
export class ReadNotificationController {
  constructor(private readonly readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(200)
  async execute(
    @CurrentUser() user: UserPayload,
    @Param('id', zodIdParamValidationPipe) notificationId: IdParamSchema,
  ) {
    const response = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (response.isLeft()) {
      throw new BadRequestException(response.value.message)
    }

    return {
      notification: NotificationPresenter.toHttp(response.value.notification),
    }
  }
}
