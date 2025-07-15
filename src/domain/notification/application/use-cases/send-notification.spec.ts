import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      title: 'notification 1',
      recipientId: 'recipient-1',
      content: 'New notification',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(
      expect.objectContaining({
        notification: expect.objectContaining({ content: 'New notification' }),
      }),
    )
  })
})
